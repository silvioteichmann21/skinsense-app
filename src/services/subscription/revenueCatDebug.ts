import type { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

import { getRevenueCatEntitlementId } from '@/config/env';

const LOG_PREFIX = '[RevenueCat]';

function devLog(message: string, payload?: Record<string, unknown>): void {
  if (!__DEV__) return;
  if (payload) {
    console.log(`${LOG_PREFIX} ${message}`, payload);
    return;
  }
  console.log(`${LOG_PREFIX} ${message}`);
}

export function logRevenueCatInit(details: {
  configured: boolean;
  appUserId?: string | null;
  apiKeyPrefix?: string;
  reason?: string;
}): void {
  devLog('SDK initialization', {
    configured: details.configured,
    appUserId: details.appUserId ?? '(anonymous)',
    apiKeyPrefix: details.apiKeyPrefix ?? '(none)',
    reason: details.reason,
  });
}

export function logRevenueCatOfferings(offerings: PurchasesOfferings): void {
  const current = offerings.current;
  devLog('Offerings', {
    currentIdentifier: current?.identifier ?? null,
    packageCount: current?.availablePackages.length ?? 0,
    packages:
      current?.availablePackages.map((pkg) => ({
        identifier: pkg.identifier,
        productId: pkg.product.identifier,
        price: pkg.product.priceString,
      })) ?? [],
  });
}

export function logRevenueCatCustomerInfo(
  context: string,
  customerInfo: CustomerInfo,
  extra?: Record<string, unknown>,
): void {
  const entitlementId = getRevenueCatEntitlementId();
  const skinSensePro = customerInfo.entitlements.active[entitlementId];
  const activeKeys = Object.keys(customerInfo.entitlements.active);

  devLog(`CustomerInfo (${context})`, {
    originalAppUserId: customerInfo.originalAppUserId,
    activeEntitlementKeys: activeKeys,
    [`entitlements.active["${entitlementId}"]`]: skinSensePro
      ? {
          isActive: skinSensePro.isActive,
          productId: skinSensePro.productIdentifier,
          expirationDate: skinSensePro.expirationDate,
          willRenew: skinSensePro.willRenew,
        }
      : null,
    isPremium: Boolean(skinSensePro?.isActive),
    ...extra,
  });
}

export function logRevenueCatPurchaseStart(planId: string, pkg: PurchasesPackage): void {
  devLog('Purchase started', {
    planId,
    packageId: pkg.identifier,
    productId: pkg.product.identifier,
    offeringId: pkg.offeringIdentifier,
  });
}

export function logRevenueCatPurchaseResult(
  customerInfo: CustomerInfo,
  planId: string | null,
): void {
  const entitlementId = getRevenueCatEntitlementId();
  const skinSensePro = customerInfo.entitlements.active[entitlementId];

  devLog('Purchase result', {
    planId,
    originalAppUserId: customerInfo.originalAppUserId,
    activeEntitlementKeys: Object.keys(customerInfo.entitlements.active),
    skinSenseProActive: Boolean(skinSensePro?.isActive),
    skinSenseProProductId: skinSensePro?.productIdentifier ?? null,
    skinSenseProExpires: skinSensePro?.expirationDate ?? null,
  });
}

export function logRevenueCatWarning(message: string, payload?: Record<string, unknown>): void {
  if (!__DEV__) return;
  console.warn(`${LOG_PREFIX} ${message}`, payload ?? '');
}
