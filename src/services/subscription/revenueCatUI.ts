import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import type { CustomerInfo, PurchasesError } from 'react-native-purchases';

import { getRevenueCatEntitlementId } from '@/config/env';
import {
  getCurrentRevenueCatOffering,
  isRevenueCatReady,
  syncPremiumFromCustomerInfo,
} from '@/services/subscription/revenueCat';

export { PAYWALL_RESULT, RevenueCatUI };

type CustomerCenterCallbacks = NonNullable<
  NonNullable<Parameters<typeof RevenueCatUI.presentCustomerCenter>[0]>['callbacks']
>;

export function isRevenueCatUiAvailable(): boolean {
  return isRevenueCatReady();
}

export function hasSkinSenseProEntitlement(customerInfo: CustomerInfo): boolean {
  return syncPremiumFromCustomerInfo(customerInfo).isPremium;
}

/** Present RevenueCat dashboard paywall modally. */
export async function presentRevenueCatPaywall(options?: {
  displayCloseButton?: boolean;
}): Promise<PAYWALL_RESULT> {
  if (!isRevenueCatUiAvailable()) {
    return PAYWALL_RESULT.NOT_PRESENTED;
  }

  try {
    const offering = await getCurrentRevenueCatOffering();
    return await RevenueCatUI.presentPaywall({
      offering: offering ?? undefined,
      displayCloseButton: options?.displayCloseButton ?? true,
    });
  } catch (e) {
    if (__DEV__) console.warn('[RevenueCatUI] presentPaywall failed:', e);
    return PAYWALL_RESULT.ERROR;
  }
}

/** Present paywall only if SkinSense Pro is not active. */
export async function presentRevenueCatPaywallIfNeeded(options?: {
  displayCloseButton?: boolean;
}): Promise<PAYWALL_RESULT> {
  if (!isRevenueCatUiAvailable()) {
    return PAYWALL_RESULT.NOT_PRESENTED;
  }

  try {
    const offering = await getCurrentRevenueCatOffering();
    return await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: getRevenueCatEntitlementId(),
      offering: offering ?? undefined,
      displayCloseButton: options?.displayCloseButton ?? true,
    });
  } catch (e) {
    if (__DEV__) console.warn('[RevenueCatUI] presentPaywallIfNeeded failed:', e);
    return PAYWALL_RESULT.ERROR;
  }
}

export function isPaywallPurchaseSuccess(result: PAYWALL_RESULT): boolean {
  return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
}

/** Present RevenueCat Customer Center (manage subscription, restore, refunds). */
export async function presentRevenueCatCustomerCenter(
  callbacks?: CustomerCenterCallbacks,
): Promise<void> {
  if (!isRevenueCatUiAvailable()) {
    throw new Error('RevenueCat Customer Center requires a configured SDK');
  }

  await RevenueCatUI.presentCustomerCenter({ callbacks });
}

export function formatPurchasesError(error: PurchasesError): string {
  return error.message || 'Purchase failed. Please try again.';
}
