import { Metrics } from "../Themes";
import { Platform, View, ActivityIndicator } from 'react-native';

export default () => <View style={{ height: Metrics.screenHeight, width: Metrics.screenWidth, justifyContent: 'center', alignItems: 'center' }}>
    {
        Platform.OS == 'ios' ?
            <ActivityIndicator size={1} color={"#a4a4a4"} />
            :
            <ActivityIndicator size={50} color={"#a4a4a4"} />
    }
</View>