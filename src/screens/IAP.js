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

import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

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
import { getContentByAction, postData } from '../api/rest';
import AsyncStorage from "@react-native-community/async-storage";

const itemSkus = Platform.select({
  ios: [
    '12MONTHAGENTPLUS',
    '6MONTHAGENTPLUS',
    '1MONTHSAGENTPLUS',
  ],
  android: [],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class IAPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      currentPlan: itemSkus[0],
      productList: [],
      requestResult: '',
      purchaseReceipt: '',      
      purchaseSuccess: false,
      purchaseSuccessResult: {}
    }
  }

  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
      // console.log('result', result);
    } catch (err) {
      console.log('init connection error', err.code, err.message);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;
        console.log('receipt', receipt);
        this.setState({ purchaseReceipt: receipt });
        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
            }
            const ackResult = await finishTransaction(purchase);
            console.log('finish result', ackResult); 
            this.purchaseValidate();           
          } catch (ackErr) {
            console.log('ackErr', ackErr);
          }
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        console.log('purchaseErrorListener', error);
        Alert.alert('Purchase Error', JSON.stringify(error));
      },
    );    

    this.getItems();
  }
  
  componentWillUnmount() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  }
  
  getItems = async () => {
    this.setState({ spinner: true });    
    try {
      const products = await RNIap.getProducts(itemSkus);
      var sortedProducts = products.sort((a, b) => { return a.price - b.price });
      this.setState({ productList: sortedProducts, spinner: false });
      //console.log('productList', sortedProducts);
    } catch (err) {
      this.setState({ spinner: false });
      console.log('get products error', err.code, err.message);
    }
  };

  requestSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku)
        .then((res) => {
          //console.log('request subscription result', res);
          this.setState({ requestResult: res });
        })
        .catch((err) => {
          console.log('request subscription error', err);
        })
    } catch (err) {
      console.log('request subscription error', err.message);
      Alert.alert('Request Subscription Error', err.message);
    }
  };

  purchaseValidate = () => {
    if(this.state.requestResult.transactionReceipt == this.state.purchaseReceipt){      
      this.postPurchase();      
    }
    else{
      console.log('validation error');
    }
  }

  postPurchase = () => {
    let bodyFormData = new FormData();
    bodyFormData.append('action', 'payment');
    bodyFormData.append('agent_account_no', LoginInfo.user_account);
    bodyFormData.append('productId', this.state.requestResult.productId);
    bodyFormData.append('transactionId', this.state.requestResult.transactionId);
    bodyFormData.append('transactionDate', this.state.requestResult.transactionDate);
    bodyFormData.append('os_transaction', Platform.OS === 'ios' ? 'apple' : 'google');
    
    await postData(bodyFormData)
      .then((res) => {
        //console.log('post attendee success', res);

        this.setState({ 
          purchaseSuccess: true, 
          purchaseSuccessResult: res
        });
      })
      .catch((err) => {
        console.log('post attendee error', err)
      })
  }

  onPressPlan = (plan) => {
    this.setState({ currentPlan: plan });

    var txt = plan == itemSkus[0] ? 'YEAR SUBSCRIPTION' : plan == itemSkus[1] ? '6 MONTHS SUBSCRIPTION' : 'MONTH-TO-MONTH SUBSCRIPTION';
    setTimeout(() => {
      Alert.alert(
        'Are you sure to ' + txt + '?',
        '',
        [
          { text: 'Yes', onPress: () => this.requestSubscription(plan) },
          { text: 'No', onPress: () => { } },
        ],
        {
          cancelable: true
        }
      )
    }, 300);
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={'AGENT PLUS™ ACTIVATION'} titleColor={Colors.blackColor} noLeftIcon />
        </View>
        {
          !this.state.purchaseSuccess &&
          <>
            <View style={styles.txtContainerFirstPage}>
              <Text style={styles.txtBold}>
                No appointments or special equipment necessary!
              </Text>
              <Text style={styles.txt}>
                All you need is a subscription and a supported device to start using Agent Plus™
                {'\n'}
              </Text>
              <Text style={styles.txtBold}>
                No hidden costs or fees!
              </Text>
              <Text style={styles.txt}>
                We keep it simple with straight-forward pricing.
                {'\n'}
                Plans start as low as $9.99 per month
                {'\n'}
              </Text>
              <Text style={styles.txtBold}>
                No commitments or cancellation hassle!
              </Text>
              <Text style={styles.txt}>
                Change your mind? No problem. Switch plans or cancel at any time hassle free.
              </Text>
            </View>

            <View style={styles.mainContainerFirstPage}>
              <View style={styles.btnsPart}>
              {
                this.state.productList.length == 3 &&
                <>
                  <TouchableOpacity style={[styles.btn, this.state.currentPlan == itemSkus[0] ? { borderWidth: normalize(5), borderColor: Colors.greenColor } : null]} onPress={() => this.onPressPlan(itemSkus[0])}>
                    <View style={styles.btnLeft}>
                      <Text style={styles.mainPriceTxt}>${parseInt(this.state.productList[0].price)}</Text>
                      <Text style={styles.subPriceTxt}>.{(this.state.productList[0].price - parseInt(this.state.productList[0].price)).toFixed(2).split('.')[1]}</Text>
                    </View>
                    <View style={styles.btnRight}>
                      <Text style={styles.rightTxt}>
                        PER MONTH
                        {'\n'}
                        SAVE 60%
                        {'\n'}
                        YEAR SUBSCRIPTION
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn, this.state.currentPlan == itemSkus[1] ? { borderWidth: normalize(5), borderColor: Colors.greenColor } : null]} onPress={() => this.onPressPlan(itemSkus[1])}>
                    <View style={styles.btnLeft}>
                      <Text style={styles.mainPriceTxt}>${parseInt(this.state.productList[1].price)}</Text>
                      <Text style={styles.subPriceTxt}>.{(this.state.productList[1].price - parseInt(this.state.productList[1].price)).toFixed(2).split('.')[1]}</Text>
                    </View>
                    <View style={styles.btnRight}>
                      <Text style={styles.rightTxt}>
                        PER MONTH
                        {'\n'}
                        SAVE 20%
                        {'\n'}
                        6 MONTHS SUBSCRIPTION
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn, this.state.currentPlan == itemSkus[2] ? { borderWidth: normalize(5), borderColor: Colors.greenColor } : null]} onPress={() => this.onPressPlan(itemSkus[2])}>
                    <View style={styles.btnLeft}>
                      <Text style={styles.mainPriceTxt}>${parseInt(this.state.productList[2].price)}</Text>
                      <Text style={styles.subPriceTxt}>.{(this.state.productList[2].price - parseInt(this.state.productList[2].price)).toFixed(2).split('.')[1]}</Text>
                    </View>
                    <View style={styles.btnRight}>
                      <Text style={styles.rightTxt}>
                        PER MONTH
                        {'\n'}
                        BILLED MONTHLY
                        {'\n'}
                        MONTH-TO-MONTH
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              }
              </View>

              <View style={styles.bottomTxtPart}>
                <Text style={styles.bottomTxt}>
                  Limited time offer. You will be charged the selected price on the same day each month until you cancel.
                  All subscriptions renew automatically. You can cancel anytime. Mobile apps are not supported on all devices.
                  These offers are not available for current subscribers. Other restrictions and taxes may apply.
                  Offers and pricing are subject to change without notice.
                </Text>
              </View>
            </View>
          </>
        }
        {
          this.state.purchaseSuccess &&
          <>
            <View style={styles.txtContainerResultPage}>
              <Text style={styles.txtBold}>
                CONGRATULATIONS!
              </Text>
              <Text style={styles.txt}>
                {'\n'}
                Your Agent Plus™ Account Is Now Active.
              </Text>
            </View>

            <View style={styles.mainContainerResultPage}>
              <View style={styles.topPart}>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Item Purchased:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.item_purchased}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Item SKU/ID:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.item_sku_id}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Subscription Type:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.item_subscription_type}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Subscription Starting Date:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.item_subscription_starting_date}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Subscription Ending Date:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.item_subscription_ending_date}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Monthly Subscription Cost:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.monthly_subscription_cost}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Total Amount Billed At This Time:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.total_amount_billed_at_this_time}</Text>
                  </View>
                </View>
                <View style={styles.itemLine}>
                  <View style={styles.itemName}>
                    <Text style={styles.itemTxt}>Transaction Number:</Text>
                  </View>
                  <View style={styles.itemValue}>
                    <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.transaction_number}</Text>
                  </View>
                </View>

                <View style={[styles.itemLine, {width: '100%'}]}>                  
                  <Text style={styles.itemTxt}>{this.state.purchaseSuccessResult.transaction_text}</Text>
                </View>                
              </View>

              <View style={styles.bottomPart}>
                <Button btnTxt="Let's Get Started" btnStyle={{ width: '100%', height: '100%', color: 'blue', fontSize: RFPercentage(4) }} onPress={() => this.props.navigation.navigate('Splash')} />
              </View>
            </View>
          </>
        }
      </View >
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
  txtContainerFirstPage: {
    width: '93%',
    height: '28%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
    paddingTop: normalize(15),
    paddingBottom: normalize(15),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
    textAlign: 'center',
  },
  txtBold: {
    fontFamily: 'SFProText-Bold',
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
    textAlign: 'center',
    lineHeight: 22
  },

  mainContainerFirstPage: {
    width: '100%',
    height: '62%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
    // borderColor: '#ff0000',
    // borderWidth: 5,
    padding: normalize(20),
  },
  btnsPart: {
    width: '100%',
    height: '82%',
    justifyContent: 'space-between',
    alignItems: 'center',
    //borderWidth: 2
  },
  btn: {
    width: '100%',
    height: '29%',
    flexDirection: 'row',
    backgroundColor: Colors.blueColor,
    //marginBottom: normalize(17, 'height'),
    borderRadius: normalize(10)
  },
  btnLeft: {
    width: '40%',
    height: '100%',
    flexDirection: 'row',
    padding: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 2
  },
  mainPriceTxt: {
    fontFamily: 'SFProText-Bold',
    fontSize: RFPercentage(6),
    color: Colors.greenColor,
    textAlign: 'center',
  },
  subPriceTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(3),
    color: Colors.greenColor,
    textAlign: 'center',
    marginBottom: normalize(30)
  },
  btnRight: {
    width: '60%',
    height: '100%',
    padding: normalize(2),
    justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 2
  },
  rightTxt: {
    fontFamily: 'SFProText-Bold',
    fontSize: RFPercentage(1.8),
    color: Colors.whiteColor,
    // textAlign: 'center',
    lineHeight: 23
  },

  bottomTxtPart: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 2
  },
  bottomTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.1),
    color: Colors.blackColor,
    textAlign: 'center',
  },

  txtContainerResultPage: {
    width: '93%',
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
    paddingTop: normalize(15),
    paddingBottom: normalize(15),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  mainContainerResultPage: {
    width: '100%',
    height: '78%',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
    // borderColor: '#ff0000',
    // borderWidth: 5,
    padding: normalize(20),
  },
  topPart: {
    width: '100%',
    height: '84%'
  },
  itemLine: {
    width: '100%',
    height: normalize(30),
    flexDirection: 'row',
    //borderWidth: 1
  },
  itemName: {
    width: '60%',
    height: '100%',
  },
  itemValue: {
    width: '40%',
    height: '100%'
  },
  itemTxt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
  },
  bottomPart: {
    width: '100%',
    height: '14%'
  },
});