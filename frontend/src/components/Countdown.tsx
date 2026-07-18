import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import {
  colors,
  font,
  spacing,
  radius,
  EVENT_START,
} from "../theme";


function calculateDifference(target: Date) {
  const total = Math.max(
    0,
    target.getTime() - Date.now()
  );

  return {
    days: Math.floor(total / 86400000),

    hours: Math.floor(
      (total % 86400000) / 3600000
    ),

    mins: Math.floor(
      (total % 3600000) / 60000
    ),

    secs: Math.floor(
      (total % 60000) / 1000
    ),
  };
}


function Block({
  value,
  label,
  testID,
}: {
  value:number;
  label:string;
  testID:string;
}) {

  const display =
    value < 10
      ? `0${value}`
      : String(value);


  return (
    <View
      style={styles.block}
      testID={testID}
      accessibilityLabel={`${display} ${label}`}
    >
      <Text style={styles.value}>
        {display}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>

    </View>
  );
}



export default function Countdown(){

  const {width} = useWindowDimensions();

  const compact = width < 390;


  const [
    countdown,
    setCountdown
  ] = useState(() =>
    calculateDifference(EVENT_START)
  );


  useEffect(()=>{

    let timer:ReturnType<typeof setTimeout>;


    const update = () => {

      setCountdown(
        calculateDifference(EVENT_START)
      );

      timer=setTimeout(
        update,
        1000
      );

    };


    update();


    return ()=>clearTimeout(timer);

  },[]);



  return (

    <View
      style={styles.wrap}
      testID="countdown-section"
    >

      <View style={styles.tagRow}>

        <View style={styles.dot}/>

        <Text style={styles.tag}>
          COUNTDOWN TO KICKOFF
        </Text>

      </View>



      <View style={styles.row}>


        <Block
          value={countdown.days}
          label="DAYS"
          testID="countdown-days"
        />


        <Text style={styles.sep}>
          :
        </Text>


        <Block
          value={countdown.hours}
          label="HRS"
          testID="countdown-hours"
        />


        <Text style={styles.sep}>
          :
        </Text>


        <Block
          value={countdown.mins}
          label="MIN"
          testID="countdown-mins"
        />


        <Text style={styles.sep}>
          :
        </Text>


        <Block
          value={countdown.secs}
          label="SEC"
          testID="countdown-secs"
        />


      </View>

    </View>

  );
}



const styles = StyleSheet.create({

  wrap:{
    paddingHorizontal:spacing.lg,
    paddingVertical:spacing.xl,
    backgroundColor:colors.surface,
  },


  tagRow:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:spacing.lg,
    gap:spacing.sm,
  },


  dot:{
    width:8,
    height:8,
    borderRadius:radius.pill,
    backgroundColor:colors.brand,
  },


  tag:{
    color:colors.onSurfaceTertiary,
    fontFamily:font.bold,
    fontSize:12,
    letterSpacing:2,
  },


  row:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:spacing.xs,
  },


  block:{
    backgroundColor:colors.surfaceSecondary,
    borderWidth:1,
    borderColor:colors.border,
    borderRadius:radius.lg,
    paddingVertical:spacing.md,
    minWidth:68,
    alignItems:"center",
  },


  value:{
    color:colors.onSurface,
    fontFamily:font.display,
    fontSize:40,
    lineHeight:42,
  },


  label:{
    color:colors.onBrandTertiary,
    fontFamily:font.bold,
    fontSize:10,
    letterSpacing:2,
    marginTop:2,
  },


  sep:{
    color:colors.brand,
    fontFamily:font.display,
    fontSize:34,
  },

});