import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Text,
  Image,
  TextInput,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Spinner from 'react-native-loading-spinner-overlay';
import Share from 'react-native-share';

import {
  Button,
  AgentCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { getContentByAction, postData } from '../../api/rest';

export default class ClientShareScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    }
  }

  componentDidMount() {

  }

  onSupportedShare = (socialKind) => {
    //supported: facebook, instagram, twitter, whatsapp
    let shareOption = {
      url: 'https://apps.apple.com/us/app/open-houses-and-virtual-tours/id1517663733',      
      title: 'Open Plus™',
      subject: 'Open Plus™',
      social: socialKind,
      message: this.props.route.params.clientFullname + ' was invited by ' + LoginInfo.fullname,
      email: this.props.route.params.clientEmail
    };

    setTimeout(() => {
      this.setState({ spinner: true });
      Share.shareSingle(shareOption)
        .then((res) => {
          //console.log('share result', res);
          this.setState({ spinner: false });
        })
        .catch((err) => {
          //console.log('share error', err);
          this.setState({ spinner: false });
        })
    }, 500);
  }

  onUnSupportedShare = (socialKind) => {
    //not supported: messenger, email, linkedin, youtube, snapchat, pinterest, tiktok   
    const url = 'https://apps.apple.com/us/app/open-houses-and-virtual-tours/id1517663733';
    const title = 'Open Plus™';
    const message = this.props.route.params.clientFullname + ' was invited by ' + LoginInfo.fullname;    
    let icon = '';

    if(socialKind == 'messenger') icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAKVElEQVR4nO2de3BU1R3HP797dzevTUJAUBIeSYy1itqOta0CdtAOKgyR2lILra1OURDQ2nbU4hQRtGgrWqeMgvgYoU5tJ0PFAqK0UrFqq22xtohTbCFAEYUAebFL2Mf99Y+Nmo0he/fu4+7G/czcTPbMefz2fO85555zfucuFChQoECBAgUKFChQ4JOGuFWwPstoLMajnI1QD5wKnASUd18And3XIWBn97UNeEUa2euC2WknawLoi3g4ysXANGAyUJNilvtQNqKsoYIX5SIiqVuZfTIugD7DSEzmAtcSu8MzQQvwGCbLZTL7MlRGRsiYALqWWkzuQpgOeDJVTi/CwK+B2/Oli0q7ALqJMsIsQrkRKEp3/jbpApYBi6WRoEs22CKtAugGxqKsAk5LZ74p0Ax8VxrZ4rYhJ8JIRyaqiK5nEcrL5E7lA9QBm3UDt6u698TXHykbpZsoI8Rq4GtpsCeTrMHHNXIpAbcN6UlKAnRX/gZgQnrMyTDCq0SZJFPpdNuUD3AsgG6kgijPAxek0Z7Mk2MiOBoDdBEGUX5FvlU+gDIOoUmbMN02BZwOwp9jKTAlvaZkEeEySrjbbTPAQRekv2MiBpucpM05lMlyOc+5aUJSlahrGYSHbcCIDNmTbfYjnCVTaHXLgOS6IC9LGDiVD1CNxWI3DbDdAnQddQj/BnwZtMcNwpicIZPZ6UbhySyS3UkylX/B+qSNSSt/abQb00uUhcDVGbTmhNjqgnQjQxG+nmljXGS6bmSoGwXbGwOizMS9lc1s4COSwy0AmJ5RK3KDb7hRaMJBWJ/lFCz224mb51hYVMtUDmSz0MQtwOISBn7lAxiYTMx+oYkQPpsFO3KFz2S7wMQCKGOyYEdO8Fpw7Ozanx+a37BMs/bAYWcQrs+4FTnCMOP9cit0/J7QsfeCtfcffKnh3pZzM12mHQEqM21ErlDp6Yj9o2pY4fCXQhraWre8Y3X9ymOjMlVm4qeg9XThZA6QPzPhDwmpj9Pebu4RIpgV5QBdIrKsyyhbvH+2pNXLwk4L+CQ8ASWiWFVvLYoG3qpd0TkhnRnbESAntu6yQadVEfdZPnbraZ0om+tWdN6OalpuTDsCtKWjoHygPRIvQB8KABgod9Y9fLTp5KXvl6Vapp3V0P8S81xODgd9sNvsDdfGBxj93J/KtNKysuGnP94yacfMoY57CTsTsbedZp5v7Og6Pe6z9CdAjHGh48XPnf54S3miiCfCzkRsq9PM8423u86MD0gsAMC40PGiJprUkZeFnbWgFwB1knk+YWHwSuDCuDDx2K1Tuaz+cMCRl0VCAbpXB990knk+8daxszkU6bEnIwKG/ZtaVW8dvTwwKdly7e0HKE8mm3G+sa5jatxn8SR/pMHAemzU8raqZNLYKyXCL/FyD8nMiDM9E07jU1ZIfTzdNi0uzIkAQLWJuRj4nt0EtlqAfJXDMHBbwbr2qRyODPkoQAS8XqfZXd+wss32Y3syMt8FfIcB5pYSwccbg+/gksEf9RxjTjI4a2h8/z/r+S67WXqjUcO2l4VtxyxpZC/CQ3bj5wsvyXW09FhxNwROrUr13IpMb1jWacvLIrmOTlkAfIXYyZP+yYOZcBvVrJMFcWGnVRmUeFJe5vFFTbkauC9RxKSklkaCWMwGLKeW5QqK8ISsJNhju8NnCmcMScupLcCy5WXhSGpdx0LEXZ/KVFl+6AZ+duC2uDApKcFwPvj2xsIr1c3X+fv1snAm9xv8BFjrKG0O8PvOS1l64EdxYeLxpLPyAQzCib0sHAkgi7AwmQFsdpLeTf4a/CI37XsQq+dXFwOjpCQDpVkJvSwcd3gymeN4udJpejd4PXA+1+x5kqBV2iNUMEpLTrT2nxJCYo+S1EacKI6XYbPNs+1TuGbvkwSs+D0Uo7QEMTNzXEyRhBOy1N7hYPH5lNJngSgmDxy4mQcP3Ujvs9pGcbHTJQe7DEoUIdXSpyWO4h4t1LHKWMk7w8czcfhH4SJw7skmDUlMuJKYCfckoUuPYwH0GUYSm5TlHGFK+IPcwAaZT5j4wdU0YGyNSbU/Xc/7qeG8BZjcS46dGYjg4zWZwTpZQGsf74Py+2BsjYeq4qx52rQniuBIAN3AVag7/vR90SlD+RMzeVFm0c4pfcYZWW5w3nADn5lVN6f0C6DrGY/yKC47bL0bHsEfOy9mY8cUXg+cT/TDg++9TpwaBkaRD/H6WPVWdm1U1f8kipOUALqeacBqoNi5UcL9Lbfwm9YZjCnZzplF2zmzeDvV3v1Umu1UGO1Umu2YEiVgldFpVXAkMpg9odHsCdWy4/in+VvwC7wXHp6wLMPnQ4qKXbtVxIZHiS0BtIkSilkA3EZqX+fAksOLtz7aMnMywJbOYWzpvCiF7PpABPH5MLy+2Nqyi4gabySMkyiCrqcR+AV2lqBPTAfCI4RZMrr5cA2hrrR3BmKa4PUiXl8mJrVOsAxh+M455Qf7i2SnBZQDTlaposDLwFqKWS0TPxiQhrSNWvp+gGg0Rbc+QTxmbCLl8dhxosoyunXnnIp+Kx9sCCCNPKVNrKGECcAVKOch1AIVxPyFOrqvIwjNWPwLg22EeLV7L/ljGB5zswWXi9cLltV9Kard2wza/Uck1kbFQETAMBDDBNNATIPcdtwWW3vornyDuvtaR1Nq7gBxPI945DLHzwF94nCmeyJCXlNr3pldcShRRFfabfPNVXuAJjfKzgaiPGGn8sElAQCsqHUHEHKr/AwSsozIT+1Gdk2APTcOakZ5xK3yM4cu2z2narfd2K6OYvUrj1Rq1LsNGOmmHelD95Rq11nb5w07ajeFq89uu2YPbleVWQwM72tLLGNmMpUPLgsAsHue/3mQhP4zecAdu27wJ71H7roAAM0Hy+aDbHDbjhT4bfMc/xInCXNCABaJ5Ss69k3gVbdNccALZsT/LUQcdaM5NZUc89BBf1BKNgIXJoycI4R91pB911YecZo+N1pAN9vnDTsaDAQmIaxx2xa7+KI+fyrpc0oAgAO3nBJovt5/JcJC8sEHNRI5L5XkOScAACLaPKf8LsvQ8cAOt83pD0tSe21/To0BfVG9UkuLo4GFit5ECjtxGaQrLGbDvjml7zpJnJstoAf7Z0tw11z/fEPNT4nIKmI/1JNLFHs0eq/TxDnfAnozYkWwxqvRD34Wa5jb9nSjgly1a67/qWQT5p0AH9KkZv3BwAQMnaaxH4bL2EuVbNJlqH5557yKPyeTKH8F6EXDsuCIiDc6HpVzRPVU0HrEOAm0EvAT2yJtBdoUWgX+p+g/UOOfwJsiei2x1zOnUidBUb69a17503YTDBgB0sHoFR1XGCoPk1rXZiHcEz7mX7Lvh3IsUeSCAL2ofaB1kBSZPwaZRWzf2ym7UP1+87yKfk+s5/xTULbZ/YOqtua5FbeIGR6lwk3AFmLdV3IIPhEj4fmJQguwQc2DHUN8BuNQORs4B9E6RQZLrIVUEKvHDlR3i8jfVWVt6dCyLduvlIG45VqgQIECBQoUKFCgQIEU+T9EdMyLEcD9DAAAAABJRU5ErkJggg=='
    else if(socialKind == 'email') icon = 'data:image/png;base64,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'
    else if(socialKind == 'linkedin') icon = 'data:image/png;base64,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'
    else if(socialKind == 'youtube') icon = 'data:image/png;base64,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'
    else if(socialKind == 'snapchat') icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAKAUlEQVR4nO2dfXBU1RXAf+e9ZLObAMkmShVbC9oKVvxgbJXBfgF+DFNARo0kWtRR20619avVP/qX/3VUOq10OnXs1FKd0UDaOoDVdhyhrTqjdqaIVBRUsPIhFMkXIWGz+97pH2+RCDHvvd173yZ0fzOZnWTuPefsObn3vXfvuedBlSpVqlSpUqVKlSpV/t+QShswGnpw2WSGcrNwnOmoTkdlOqKTQRqALNBQbHoI6AY9hDj7UH8b4ryN728l5W+UiZ37K/ctRmdMBUD3LKonU38ZvsxDdC7ITMq3UYHNqGzA0fX0e8/L5zoHDZhrhIoHQPV+h+6tc0CXAW3AJMsq+4A1IJ1kC8+KdHqW9Y1KxQKgO25K05i7GfTHwLQKmbEddDnZvsdEnstVwoDEA6B7FtVT13Abwj3AqUnr/xQ+RHU5uYFHZMq6gSQVJxoA7WpfBLoCmJqk3hjsQrlbWjr+kJTCRAKg3W1TUX4JLExCnwHWgvdDae78wLYi6wHQ7vYlqD5GcNs4nuhD5TvS8tRqm0qsBUB1QR1djQ8i3GFLR0I8Srb3DlsXaSsB0L4bWigMPQPMtiG/AryM6y2Wxs4u04KNB0D3t03B1b+AnGtadoV5C+UKaenYaVKoY1KYftQ+A5dXTkDnA5yN8JLub51uUqixEaAftZ6G474MfN6UzDHKbsS5RLJP/seEMCMjQPtuaMFxn+fEdz7Aaag+q72tzSaElR0A1QV1xQvu2QbsGSfol/DcdaoL6sqVVP4I6G78GSfO3U4c5tDV+GC5Qsq6BuiBtmsQOss1IhIyEVIXQc3Z4J4e/O5MAgT0IPh94H0Ahbdg6NXgb4nYpVdLdtWfSu5easfi8sLrQGOpMiLhTIbMtZC6GKiJ2KkQBGFwNfj/tWkdoD2Ie0GpF+Wo32gEvboCxKLzBdJLIHMV8c2sgdQlQdAG/wiH1xDsy9hAmlD/YWBJSb1L6VRc33m6lL6RkBTU3x5MOSYYeg0GfgU6ZEbeiMhiaX5qXexecTvonkX1pBu2YO2WU6DhB5CaY1bs0Ktw6GHsjQR2cMg7J+52Z/y7oHT97di8389cY975EExHmavNyz3KNCbUfC9up1gBCO575a64SiLjToH0ldbEk14C7mftyVe9T3fclI7TJd4I6G66BZgSq08cMtcBrjXx4EJmqUX5nEpj7sY4HSIHQPV+p7iBbgd3GtReaE38x9R+GdypFhXovarRr63RR0DPlm9gM3shdbE10cfrMnR3NTJn0nPt16I2jh4A311WkjlRcc+wKj5ZXRLZV5ECoDtbM4heVbpBUSxJcMvYti6Va3VnayaSKZEETnAux/qSg+2EuGGIdV2TaHDnRWkYLQC+RBJWHrHu3spDIv1zlqlD50ZpFi0AEYWVh7Un1BHw7atQ5kdpFhoAPbhscjFL2TIJOCVRXXKe9rWfFNYqfAQM5WaRSAZdwb6KI2giuhyGvAvCG4W2cIxmAXwqmmTKfkK6IvguPACqJ14AEtMV7rvwAIhzlhFbwtAEs8IT0yWhAQjfalI9xYgtR6g9F2ouAO99yL9a3CRJ+piCFH+0uNc8B5wWyP8TCu+YVBTqu9Bvrl1t72Nq/b9mJkz8yVG1mgN/H8gEcIyk2UTnyEa+ewpHV2AV+n8K+c2mtOyQ5o5R1z2ibLZONGQMkCO43y8GQOqCDIdKIBPBHeGrqdFb1FDfRXkQm2DAkIDCO9D/AHi7jIk0hr8fDv0CCm+alBoagNKzIkol/wbk74PamZCaB6mvYHcTZjQ8yL8OuQ3BJ8kfmIwSgH7A8AStwTyb3wyHp8CE+8D5jFkVYfh7oX85eLttagnNDosyBdlNMfP2wMBKqypGZGClbefDuAgAgLfXuorjde5LQouBAIjY907tDOsqjqMmEZ2hvouwFOFvM2LKpyKQutSuipFIX479B0DdGtYiyggIFVIWqYuh5kyrKkbEnWZ7cx4I9114AHzfXgCkHjJ29/pHJbPM7u5YBN+FByCl/8LWdlX9zckvQQzHaYH679qS7pNKbww1IaxBUOxI/23GpmGkFwYp5JUmNRvS37IheZNMevxAWKNoe8LqrC/bnOHUzSumIY4RMtdD3TfNyhSN5LNoAXCiCQtHIL0Y6m9lDNSKGoYEU1GmHWN2qRvJZ9HWgvq952lweyknN8g5BepvhNrQbdIKUfzncE+Hgd8HSxWl08uh/IaIWqOh3W2/Rbk5tinuaVB3RTDtVGzRLS4e5NZD7q+lLlf8Rpo7Il3d46yGPgExApD5NtTOCnL+xx0u1F0W/Hh7gpXSwSfiCIjcOHpybtOMfwDbI7evmTpOnX8M7hSoibVp9C7ZjpeiNo4cAJH7fdDlkc04+AAMdgQbHeMVfx8MPhV8l+g8JBL9uSnWJV91QR3djduJdUpGoOYMcM8KPmu+mPzaf1T8vcGuXeE9KGwDb0dcCbvI9n4hTnGn+KckD7T/CIkxEkZSOWn52JuevN3Qdy9lPfQLd0q2Y0WcLvFPSeb6fw28H7vfxygUNpXe3RaFNyhzxeU9etKPxu0UOwBBXU29LW6/T5B/65O/6xBoP5AvS2xE5aB9x2fH5beUK/hOmbbycNxOpdeK6GpbAywurbcTrMH43eDtLDr/iEUTgoIc6QXBpwkKW+Dwc1B4+xhd9cFzikyC/EZKzppWnpaWjpJOEJURgNbTwdkE0lSqjFBSs6H+liAopaADMPgk5F4wa9cn6UY5v9RacuWVq+lauhBkbblyRsVphobvB1l1cchvhoFHwDde6HA4inC1ZDtKrptRtuP0QNvD9muDCtTNDQ5Zh53v8nvg8GrI/Q3rp26En0u2457yRJRJ8dlgPWChwMMxSAZqLwqmJvfUo5s5/gHwPoShVyD/Gmjsa2EpvEjWu1Sks6wSLEamDu1qbQT378D5JuSNA97E9b5uopBrtWxlfHaBd4mpwt7GCrfKSZ278bwrAOsVxyvIB3g632RVdaOVc+Xkzq14NbOBN0zKHRvIFpSvysmrjOZJ2Sne3dvajOeuI4kLczK8iONcKU1PdpsWbHQEHEEaO7vI7v0G8ADJnsA2jaKsIOtdasP5kMgLHJZeicrvGJcvcNBbpWWV1bqoVkbAcCS7ag3izALW2tZlDOVplJm2nQ+Jv8Rn6UKQFVTutVVhbAfukOaOPyel0PoIGI40r3qGQ945iNwNWD8dEYNdiN5Fb/qcJJ0PlXyRmy6oo7vpJtB7gQqkRwPwLvAQWW9luUsKpTIm0tO057oL8fwbEK4HWiyr6wXW4vuP07L6hTgb6DYYEwE4QvB6w8PzEeajOhfkPMqfJn1gEyIbUHmB3tT6UnaubDGmAnAs2td+EnlmIXoWMANhOspkgvO3TRw9w9wP9BCcydoHbAOKr7NNb4ySpVylSpUqVapUqVKlSpUqSfE/7BDsdncLU0EAAAAASUVORK5CYII='
    else if(socialKind == 'pinterest') icon = 'data:image/png;base64,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'
    else if(socialKind == 'tiktok') icon = 'data:image/png;base64,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'
 
    const options = Platform.select({
      ios: {
        activityItemSources: [
          { 
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          { 
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
              message: null,
            },
            linkMetadata: { title: message },
          },
          { 
            placeholderItem: { type: 'url', content: icon },
            item: {
              default: { type: 'text', content: `${message} ${url}` },
            },
            linkMetadata: { title: message, icon: icon }
          },
        ],
      },
      default: {
        title,
        subject: title,
        message: `${message} ${url}`,
      },
    });    

    setTimeout(() => {
      this.setState({ spinner: true });
      Share.open(options)
        .then((res) => {
          //console.log('share result', res);
          this.setState({ spinner: false });
        })
        .catch((err) => {
          //console.log('share error', err);
          this.setState({ spinner: false });
        })
    }, 500);
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'CLIENT REGISTERED'} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.navigate('ClientList')} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>
            Congratulations! Your Client Was Successfully
            {'\n'}
            Registered With Open House Plus™
            {'\n'}{'\n'}
            Please Share Open House Plus™ With Your Client.
            {'\n'}
            Once They Download The Application,
            {'\n'}
            You Will Be Notified.
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('messenger')}>
              <Image style={styles.shareImg} source={Images.btnMessenger} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onSupportedShare(Share.Social.FACEBOOK)}>
              <Image style={styles.shareImg} source={Images.btnFacebook} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('email')}>
              <Image style={styles.shareImg} source={Images.btnEmail} resizeMode='cover' />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onSupportedShare(Share.Social.INSTAGRAM)}>
              <Image style={styles.shareImg} source={Images.btnInstagram} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('linkedin')}>
              <Image style={styles.shareImg} source={Images.btnLinkedin} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('youtube')}>
              <Image style={styles.shareImg} source={Images.btnYoutube} resizeMode='cover' />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onSupportedShare(Share.Social.TWITTER)}>
              <Image style={styles.shareImg} source={Images.btnTwitter} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('snapchat')}>
              <Image style={styles.shareImg} source={Images.btnSnapChat} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('pinterest')}>
              <Image style={styles.shareImg} source={Images.btnPinterest} resizeMode='cover' />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => this.onUnSupportedShare('tiktok')}>
              <Image style={styles.shareImg} source={Images.btnTiktok} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onSupportedShare(Share.Social.WHATSAPP)}>
              <Image style={styles.shareImg} source={Images.btnWhatsapp} resizeMode='cover' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
              <Image style={styles.shareImg} /*source={Images.btn}*/ resizeMode='cover' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    flex: 1,
    width: width,
    height: height
  },
  headerContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  txtContainer: {
    width: '93%',
    height: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.9),
    color: Colors.blackColor,
    textAlign: 'center',
    lineHeight: 22
  },
  mainContainer: {
    width: '100%',
    height: '68%',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
    paddingTop: normalize(35, 'height'),
    // borderColor: '#ff0000',
    // borderWidth: 5
  },
  lineContainer: {
    width: '75%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //borderWidth: 1
  },
  shareImg: {
    width: normalize(65),
    height: normalize(65),
    //borderWidth: 1
  },
});