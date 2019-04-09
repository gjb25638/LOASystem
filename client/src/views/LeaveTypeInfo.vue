<template>
  <div>
    <v-card v-for="(lt) in leaveTypeInfos" :key="lt.name">
      <v-layout row wrap>
        <v-flex xs3>
          <v-card-title primary-title>
            <div :class="[lt.class, 'circle-icon', 'float-left']">
              <v-icon color="white">{{lt.icon}}</v-icon>
            </div>
            <h3 class="headline">{{lt.name}}</h3>
          </v-card-title>
        </v-flex>
        <v-flex xs9>
          <template v-if="typeof(lt.granted) === typeof('')">
            <template v-if="typeof(lt.detailInfo) === typeof('')">
              <v-card-title>
                <span class="highlight">{{lt.granted}}</span>
                |{{lt.detailInfo}}
              </v-card-title>
            </template>
            <template v-else>
              <v-card-title class="highlight">{{lt.granted}}</v-card-title>
              <v-card-title
                v-for="(subDetailInfo, index) in lt.detailInfo"
                :key="index"
              >{{subDetailInfo}}</v-card-title>
            </template>
          </template>
          <template v-else>
            <span v-for="(subGranted, index) in lt.granted" :key="index">
              <template v-if="typeof(lt.detailInfo[index]) === typeof('')">
                <v-card-title>
                  <span class="highlight">{{subGranted}}</span>
                  |{{lt.detailInfo[index]}}
                </v-card-title>
              </template>
              <template v-else>
                <v-card-title class="highlight">{{subGranted}}</v-card-title>
                <v-card-title
                  v-for="(subDetailInfo, index) in lt.detailInfo[index]"
                  :key="index"
                >{{subDetailInfo}}</v-card-title>
              </template>
            </span>
          </template>
        </v-flex>
        <v-flex xs12>
          <v-card-actions>
            <span class="highlight">{{lt.others.paidInfo}}</span>
          </v-card-actions>
          <v-card-actions>
            <span>{{lt.others.reference}}</span>
          </v-card-actions>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
    <v-card>
      <v-layout>
        <v-flex xs12>
          <v-card-title class="memo" v-for="info in localeConf.self.otherInfos" :key="info">{{info}}</v-card-title>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import utility from "@/utility";
export default {
  name: "LeaveTypeInfo",
  props: {},
  data() {
    return {
      show: false
    };
  },
  computed: {
    leaveTypeInfos: function() {
      const leaveTypes = this.localeConf.self.leaveTypes;
      return Object.keys(leaveTypes).map(key => {
        const lt = leaveTypes[key];
        const res = utility.lookUpLeaveTypeIconNClass(key);
        return Object.assign({}, lt, {
          class: res.class,
          icon: res.icon
        });
      });
    }
  },
  methods: {}
};
</script>

<style scoped>
.circle-icon {
  width: 30px;
  height: 30px;
  border-radius: 15px;
}
.circle-icon i {
  padding: 3px;
}
.float-left {
  float: left;
}
.memo {
  color: #cddc39;
}
.highlight {
  color: #2196f3;
}
</style>
