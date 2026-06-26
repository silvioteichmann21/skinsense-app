import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from 'react-native-purchases';

import {
  REVENUECAT_PRODUCT_IDS,
  LEGACY_REVENUECAT_PRODUCT_IDS,
  type SubscriptionPlanId,
} from '@/config/subscriptionPlans';
import {
  getRevenueCatApiKey,
  getRevenueCatEntitlementId,
  isRevenueCatConfigured,
} from '@/config/env';
import {
  logRevenueCatCustomerInfo,
  logRevenueCatInit,
  logRevenueCatOfferings,
  logRevenueCatPurchaseResult,
  logRevenueCatPurchaseStart,
  logRevenueCatWarning,
} from '@/services/subscription/revenueCatDebug';

export type PlanPackages = Partial<Record<SubscriptionPlanId, PurchasesPackage>>;

export type PlanPriceLabels = Partial<Record<SubscriptionPlanId, string>>;

let configured = false;

export function isRevenueCatReady(): boolean {
  return configured && isRevenueCatConfigured();
}

export async function configureRevenueCat(appUserId?: string | null): Promise<boolean> {
  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    configured = false;
    logRevenueCatInit({ configured: false, reason: 'missing API key' });
    return false;
  }

  if (!configured) {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
    Purchases.configure({
      apiKey,
      appUserID: appUserId ?? undefined,
    });
    configured = true;
    logRevenueCatInit({
      configured: true,
      appUserId,
      apiKeyPrefix: `${apiKey.slice(0, 16)}…`,
    });
  } else if (appUserId) {
    const { customerInfo, created } = await Purchases.logIn(appUserId);
    logRevenueCatCustomerInfo('logIn', customerInfo, { created });
  } else {
    const customerInfo = await Purchases.logOut();
    logRevenueCatCustomerInfo('logOut', customerInfo);
  }

  if (isRevenueCatReady()) {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      logRevenueCatCustomerInfo('afterConfigure', customerInfo);
    } catch (e) {
      logRevenueCatWarning('Failed to fetch CustomerInfo after configure', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return true;
}

export async function identifyRevenueCatUser(appUserId: string): Promise<void> {
  if (!isRevenueCatReady()) return;
  const { customerInfo, created } = await Purchases.logIn(appUserId);
  logRevenueCatCustomerInfo('identify', customerInfo, { created });
}

export async function resetRevenueCatUser(): Promise<void> {
  if (!isRevenueCatReady()) return;
  const customerInfo = await Purchases.logOut();
  logRevenueCatCustomerInfo('reset', customerInfo);
}

export function productIdToPlanId(productId: string): SubscriptionPlanId | null {
  for (const [planId, id] of Object.entries(REVENUECAT_PRODUCT_IDS) as [
    SubscriptionPlanId,
    string,
  ][]) {
    if (id === productId) return planId;
  }
  return LEGACY_REVENUECAT_PRODUCT_IDS[productId] ?? null;
}

export function planIdFromPackage(pkg: PurchasesPackage): SubscriptionPlanId | null {
  const byProduct = productIdToPlanId(pkg.product.identifier);
  if (byProduct) return byProduct;

  switch (pkg.packageType) {
    case PACKAGE_TYPE.WEEKLY:
      return 'weekly';
    case PACKAGE_TYPE.MONTHLY:
      return 'monthly';
    case PACKAGE_TYPE.THREE_MONTH:
      return 'quarterly';
    default:
      return null;
  }
}

/** Check SkinSense Pro via customerInfo.entitlements.active[entitlementId]. */
export function syncPremiumFromCustomerInfo(customerInfo: CustomerInfo): {
  isPremium: boolean;
  planId: SubscriptionPlanId | null;
} {
  const entitlementId = getRevenueCatEntitlementId();
  const skinSensePro = customerInfo.entitlements.active[entitlementId];

  if (skinSensePro?.isActive) {
    return {
      isPremium: true,
      planId: productIdToPlanId(skinSensePro.productIdentifier),
    };
  }

  if (__DEV__) {
    const activeKeys = Object.keys(customerInfo.entitlements.active);
    if (activeKeys.length > 0) {
      logRevenueCatWarning(
        `Active entitlements found but "${entitlementId}" is missing. Check REVENUECAT_ENTITLEMENT_ID.`,
        { activeEntitlementKeys: activeKeys },
      );
    }
  }

  return { isPremium: false, planId: null };
}

export type ActiveSubscriptionDetails = {
  planId: SubscriptionPlanId | null;
  expirationDate: string | null;
  willRenew: boolean;
  productId: string | null;
};

export function getActiveSubscriptionDetails(
  customerInfo: CustomerInfo,
): ActiveSubscriptionDetails {
  const entitlementId = getRevenueCatEntitlementId();
  const skinSensePro = customerInfo.entitlements.active[entitlementId];

  if (!skinSensePro?.isActive) {
    return {
      planId: null,
      expirationDate: null,
      willRenew: false,
      productId: null,
    };
  }

  return {
    planId: productIdToPlanId(skinSensePro.productIdentifier),
    expirationDate: skinSensePro.expirationDate,
    willRenew: skinSensePro.willRenew,
    productId: skinSensePro.productIdentifier,
  };
}

export async function fetchRevenueCatOfferings(): Promise<{
  packages: PlanPackages;
  priceLabels: PlanPriceLabels;
  currentOffering: PurchasesOfferings['current'];
}> {
  if (!isRevenueCatReady()) {
    return { packages: {}, priceLabels: {}, currentOffering: null };
  }

  const offerings: PurchasesOfferings = await Purchases.getOfferings();
  logRevenueCatOfferings(offerings);

  const current = offerings.current;
  if (!current) {
    logRevenueCatWarning('No current offering returned from RevenueCat');
    return { packages: {}, priceLabels: {}, currentOffering: null };
  }

  const packages: PlanPackages = {};
  const priceLabels: PlanPriceLabels = {};

  for (const pkg of current.availablePackages) {
    const planId = planIdFromPackage(pkg);
    if (!planId) continue;
    packages[planId] = pkg;
    priceLabels[planId] = pkg.product.priceString;
  }

  return { packages, priceLabels, currentOffering: current };
}

export async function getCurrentRevenueCatOffering(): Promise<PurchasesOfferings['current']> {
  if (!isRevenueCatReady()) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function getRevenueCatCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isRevenueCatReady()) return null;
  const customerInfo = await Purchases.getCustomerInfo();
  logRevenueCatCustomerInfo('getCustomerInfo', customerInfo);
  return customerInfo;
}

export async function purchaseRevenueCatPackage(
  pkg: PurchasesPackage,
  planId: SubscriptionPlanId,
): Promise<{ customerInfo: CustomerInfo; planId: SubscriptionPlanId | null; isPremium: boolean }> {
  logRevenueCatPurchaseStart(planId, pkg);

  const { customerInfo } = await Purchases.purchasePackage(pkg);
  const synced = syncPremiumFromCustomerInfo(customerInfo);
  logRevenueCatPurchaseResult(customerInfo, synced.planId);

  return {
    customerInfo,
    planId: synced.planId,
    isPremium: synced.isPremium,
  };
}

export async function restoreRevenueCatPurchases(): Promise<{
  isPremium: boolean;
  planId: SubscriptionPlanId | null;
}> {
  if (!isRevenueCatReady()) {
    return { isPremium: false, planId: null };
  }

  const customerInfo = await Purchases.restorePurchases();
  logRevenueCatCustomerInfo('restore', customerInfo);
  return syncPremiumFromCustomerInfo(customerInfo);
}

export function getSubscriptionManagementUrl(customerInfo: CustomerInfo): string | null {
  const url = customerInfo.managementURL;
  return url && url.length > 0 ? url : null;
}

export function addRevenueCatCustomerInfoListener(
  listener: (info: CustomerInfo) => void,
): () => void {
  if (!isRevenueCatReady()) {
    return () => {};
  }

  const wrapped = (info: CustomerInfo) => {
    logRevenueCatCustomerInfo('listener', info);
    listener(info);
  };

  Purchases.addCustomerInfoUpdateListener(wrapped);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(wrapped);
  };
}

export function getRevenueCatPlatformLabel(): string {
  return Platform.OS === 'ios' ? 'App Store' : Platform.OS === 'android' ? 'Google Play' : 'store';
}
