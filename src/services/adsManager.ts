import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Use test IDs in development, real IDs in production
// Replace with your real Ad Unit IDs from AdMob console
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY' // Replace with your iOS Banner ID
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'; // Replace with your Android Banner ID

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
  ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY' // Replace with your iOS Interstitial ID
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'; // Replace with your Android Interstitial ID

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
  ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY' // Replace with your iOS Rewarded ID
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'; // Replace with your Android Rewarded ID

class AdsManager {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private playCount: number = 0;
  private readonly INTERSTITIAL_FREQUENCY = 5;

  constructor() {
    this.initializeInterstitial();
    this.initializeRewarded();
  }

  getBannerAdUnitId(): string {
    return BANNER_AD_UNIT_ID;
  }

  private initializeInterstitial(): void {
    this.interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded');
    });
    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      this.interstitialAd?.load();
    });
    this.interstitialAd.load();
  }

  async showInterstitial(): Promise<void> {
    if (!this.interstitialAd) {
      this.initializeInterstitial();
      return;
    }

    try {
      if (this.interstitialAd.loaded) {
        await this.interstitialAd.show();
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }

  incrementPlayCount(): void {
    this.playCount++;
    if (this.playCount % this.INTERSTITIAL_FREQUENCY === 0) {
      this.showInterstitial();
    }
  }

  private initializeRewarded(): void {
    this.rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
    this.rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Rewarded ad loaded');
    });
    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Rewarded ad closed');
      this.rewardedAd?.load();
    });
    this.rewardedAd.load();
  }

  async showRewarded(onReward: () => void): Promise<boolean> {
    if (!this.rewardedAd) {
      this.initializeRewarded();
      return false;
    }

    try {
      if (this.rewardedAd.loaded) {
        let rewarded = false;

        const unsubscribeEarned = this.rewardedAd.addAdEventListener(
          AdEventType.EARNED_REWARD,
          () => {
            rewarded = true;
            onReward();
          }
        );

        const unsubscribeClosed = this.rewardedAd.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            unsubscribeEarned();
            unsubscribeClosed();
          }
        );

        await this.rewardedAd.show();
        return rewarded;
      }
      return false;
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }

  isRewardedAdReady(): boolean {
    return this.rewardedAd?.loaded ?? false;
  }
}

export const adsManager = new AdsManager();
export { BannerAdSize };
