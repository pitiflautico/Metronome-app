import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Test IDs for development
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxxxxx'
  : 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxxxxx';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
  ? 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxxxxx'
  : 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxxxxx';

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
  ? 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxxxxx'
  : 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxxxxx';

class AdsManager {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private playCount: number = 0;
  private readonly INTERSTITIAL_FREQUENCY = 5;

  constructor() {
    this.initializeInterstitial();
    this.initializeRewarded();
  }

  // Banner
  getBannerAdUnitId(): string {
    return BANNER_AD_UNIT_ID;
  }

  // Interstitial
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
      } else {
        console.log('Interstitial ad not ready');
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

  // Rewarded
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
      } else {
        console.log('Rewarded ad not ready');
        return false;
      }
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
