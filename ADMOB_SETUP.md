# AdMob Integration Guide

## Current Status

**The app currently runs WITHOUT AdMob** to be compatible with Expo Go for development and testing.

AdMob requires a **native build** and cannot run in Expo Go. The ads functionality has been temporarily replaced with mock implementations.

## Testing the App Now

```bash
npm install
npm start
```

The app will work perfectly in Expo Go, but ads will show as placeholders with console logs.

## Re-enabling AdMob for Production

When you're ready to build for production and enable real ads, follow these steps:

### 1. Install AdMob Package

```bash
npm install react-native-google-mobile-ads@^13.2.1
```

### 2. Update app.json

Add the AdMob plugin with your App IDs:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-YOUR_ANDROID_APP_ID",
          "iosAppId": "ca-app-pub-YOUR_IOS_APP_ID"
        }
      ],
      [
        "expo-av",
        {
          "microphonePermission": false
        }
      ]
    ]
  }
}
```

### 3. Replace adsManager.ts

Replace `src/services/adsManager.ts` with the full implementation:

```typescript
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
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? 'ca-app-pub-YOUR_IOS_BANNER_ID'
  : 'ca-app-pub-YOUR_ANDROID_BANNER_ID';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
  ? 'ca-app-pub-YOUR_IOS_INTERSTITIAL_ID'
  : 'ca-app-pub-YOUR_ANDROID_INTERSTITIAL_ID';

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
  ? 'ca-app-pub-YOUR_IOS_REWARDED_ID'
  : 'ca-app-pub-YOUR_ANDROID_REWARDED_ID';

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
```

### 4. Update HomeScreen.tsx

Replace the placeholder banner with real BannerAd component:

```typescript
// Add import
import { BannerAd } from 'react-native-google-mobile-ads';
import { adsManager, BannerAdSize } from '../../services/adsManager';

// Replace the placeholder with:
<View style={styles.adContainer}>
  <BannerAd
    unitId={adsManager.getBannerAdUnitId()}
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
</View>
```

### 5. Get AdMob App and Ad Unit IDs

1. Go to https://admob.google.com
2. Create or sign in to your account
3. Add your app for iOS and Android
4. Create ad units for:
   - Banner (Home screen)
   - Interstitial (Shows every 5 plays)
   - Rewarded (Optional features)
5. Copy the App IDs and Ad Unit IDs

### 6. Build with EAS

AdMob only works with native builds, not Expo Go:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for development (includes test ads)
eas build --platform android --profile development
eas build --platform ios --profile development

# Build for production (uses real ad IDs)
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 7. Test Ads

**Development Build:**
- Test ads will show (from TestIds)
- Test on physical device or simulator

**Production Build:**
- Real ads will show
- Make sure your app is approved in AdMob
- May take a few hours for ads to start serving

## Important Notes

- **Expo Go**: Does NOT support AdMob
- **Development Build**: Supports test ads
- **Production Build**: Supports real ads
- Test ads always show regardless of AdMob approval status
- Real ads require AdMob account approval (can take 24-48 hours)

## Ad Placements in the App

1. **Banner Ad**: Bottom of home screen (always visible)
2. **Interstitial Ad**: Shows every 5 times the metronome starts
3. **Rewarded Ad**: Can be used for premium features (currently mocked)

## Troubleshooting

**"Ad failed to load"**
- Check your internet connection
- Verify ad unit IDs are correct
- Wait for AdMob approval if using production IDs

**"Module not found: react-native-google-mobile-ads"**
- Run `npm install` again
- Clear metro cache: `npx expo start -c`

**Ads not showing in Expo Go**
- This is expected - AdMob requires a native build
- Use EAS to create a development build

## Revenue Optimization Tips

1. Place banner ads strategically (bottom of main screen ✓)
2. Don't show interstitials too frequently (every 5 plays ✓)
3. Use rewarded ads for premium features
4. Monitor performance in AdMob console
5. Test different ad formats and placements

## Links

- [AdMob Console](https://admob.google.com)
- [React Native Google Mobile Ads Docs](https://docs.page/invertase/react-native-google-mobile-ads)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
