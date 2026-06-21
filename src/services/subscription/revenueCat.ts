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
  type SubscriptionPlanId,
} from '@/config/subscriptionPlans';
import {
  getRevenueCatApiKey,
  getRevenueCatEntitlementId,
  isRevenueCatConfigured,
} from '@/config/env';

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
    return false;
  }

  if (!configured) {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
    Purchases.configure({
      apiKey,
      appUserID: appUserId ?? undefined,
    });
    configured = true;
    return true;
  }

  if (appUserId) {
    await Purchases.logIn(appUserId);
  } else {
    await Purchases.logOut();
  }

  return true;
}

export async function identifyRevenueCatUser(appUserId: string): Promise<void> {
  if (!isRevenueCatReady()) return;
  await Purchases.logIn(appUserId);
}

export async function resetRevenueCatUser(): Promise<void> {
  if (!isRevenueCatReady()) return;
  await Purchases.logOut();
}

export function productIdToPlanId(productId: string): SubscriptionPlanId | null {
  for (const [planId, id] of Object.entries(REVENUECAT_PRODUCT_IDS) as [
    SubscriptionPlanId,
    string,
  ][]) {
    if (id === productId) return planId;
  }
  return null;
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

export function syncPremiumFromCustomerInfo(customerInfo: CustomerInfo): {
  isPremium: boolean;
  planId: SubscriptionPlanId | null;
} {
  const entitlementId = getRevenueCatEntitlementId();
  const active = customerInfo.entitlements.active[entitlementId];
  if (!active) {
    return { isPremium: false, planId: null };
  }

  return {
    isPremium: true,
    planId: productIdToPlanId(active.productIdentifier),
  };
}

export async function fetchRevenueCatOfferings(): Promise<{
  packages: PlanPackages;
  priceLabels: PlanPriceLabels;
}> {
  if (!isRevenueCatReady()) {
    return { packages: {}, priceLabels: {} };
  }

  const offerings: PurchasesOfferings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) {
    return { packages: {}, priceLabels: {} };
  }

  const packages: PlanPackages = {};
  const priceLabels: PlanPriceLabels = {};

  for (const pkg of current.availablePackages) {
    const planId = planIdFromPackage(pkg);
    if (!planId) continue;
    packages[planId] = pkg;
    priceLabels[planId] = pkg.product.priceString;
  }

  return { packages, priceLabels };
}

export async function getRevenueCatCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isRevenueCatReady()) return null;
  return Purchases.getCustomerInfo();
}

export async function purchaseRevenueCatPackage(
  pkg: PurchasesPackage,
): Promise<{ customerInfo: CustomerInfo; planId: SubscriptionPlanId | null }> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  const { planId } = syncPremiumFromCustomerInfo(customerInfo);
  return { customerInfo, planId };
}

export async function restoreRevenueCatPurchases(): Promise<{
  isPremium: boolean;
  planId: SubscriptionPlanId | null;
}> {
  if (!isRevenueCatReady()) {
    return { isPremium: false, planId: null };
  }

  const customerInfo = await Purchases.restorePurchases();
  return syncPremiumFromCustomerInfo(customerInfo);
}

export function getRevenueCatPlatformLabel(): string {
  return Platform.OS === 'ios' ? 'App Store' : Platform.OS === 'android' ? 'Google Play' : 'store';
}
