/**
 * Ads Manager
 *
 * Note: AdMob functionality requires a native build and cannot run in Expo Go.
 * This is a placeholder implementation for development.
 *
 * To enable ads in production:
 * 1. Install: npm install react-native-google-mobile-ads
 * 2. Add plugin to app.json
 * 3. Build with EAS: eas build
 * 4. Replace this file with the full implementation
 */

class AdsManager {
  private playCount: number = 0;
  private readonly INTERSTITIAL_FREQUENCY = 5;

  constructor() {
    console.log('📢 Ads Manager initialized (development mode - no ads)');
  }

  // Banner
  getBannerAdUnitId(): string {
    return 'ca-app-pub-3940256099942544/6300978111'; // Test ID
  }

  // Interstitial
  async showInterstitial(): Promise<void> {
    console.log('📢 [Dev Mode] Interstitial ad would show here');
  }

  incrementPlayCount(): void {
    this.playCount++;
    if (this.playCount % this.INTERSTITIAL_FREQUENCY === 0) {
      this.showInterstitial();
    }
  }

  // Rewarded
  async showRewarded(onReward: () => void): Promise<boolean> {
    console.log('📢 [Dev Mode] Rewarded ad would show here');
    // In development, simulate reward
    if (__DEV__) {
      onReward();
      return true;
    }
    return false;
  }

  isRewardedAdReady(): boolean {
    return __DEV__; // Always ready in dev mode
  }
}

export const adsManager = new AdsManager();

// Mock BannerAdSize for development
export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
};
