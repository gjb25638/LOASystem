<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-text-field :readonly="readonly" type="text" v-model="workday.name"></v-text-field>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['早'].color"
              type="text"
              v-model="workday.morning.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="workday.morning.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="workday.morning.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['中'].color"
              type="text"
              v-model="workday.noon.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="workday.noon.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="workday.noon.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['日'].color"
              type="text"
              v-model="workday.general.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="workday.general.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="workday.general.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-text-field :readonly="readonly" type="text" v-model="holiday.name"></v-text-field>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['早'].color"
              type="text"
              v-model="holiday.morning.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="holiday.morning.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="holiday.morning.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['中'].color"
              type="text"
              v-model="holiday.noon.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="holiday.noon.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="holiday.noon.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['日'].color"
              type="text"
              v-model="holiday.general.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="holiday.general.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="holiday.general.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-text-field :readonly="readonly" type="text" v-model="summerMonday.name"></v-text-field>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['早'].color"
              type="text"
              v-model="summerMonday.morning.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="summerMonday.morning.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="summerMonday.morning.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-text-field :readonly="readonly" type="text" v-model="winterMonday.name"></v-text-field>
      </v-flex>
      <v-flex>
        <v-layout>
          <v-flex>
            <v-text-field
              :readonly="readonly"
              :background-color="daypartConf['早'].color"
              type="text"
              v-model="winterMonday.morning.name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="winterMonday.morning.startFrom"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :readonly="readonly" type="time" v-model="winterMonday.morning.endTo"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs11></v-flex>
      <v-flex>
        <v-btn v-if="!readonly" class="theme" @click="updateShiftConfig">{{loalocale.self.update}}</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import EmployeeService from "@/services/EmployeeService";
import defaultConf from "@/default";
import utility from "@/utility";
export default {
  name: "ShiftConfig",
  props: {
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      daypartConf: defaultConf.shiftDaypart,
      workday: {
        morning: {},
        noon: {},
        general: {}
      },
      holiday: {
        morning: {},
        noon: {},
        general: {}
      },
      summerMonday: {
        morning: {}
      },
      winterMonday: {
        morning: {}
      }
    };
  },
  mounted() {
    this.getShiftConfig();
  },
  methods: {
    async getShiftConfig() {
      const {
        data: { workday, holiday, summerMonday, winterMonday }
      } = await EmployeeService.getShiftConfig({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        type: "period"
      });
      this.workday = workday;
      this.holiday = holiday;
      this.summerMonday = summerMonday;
      this.winterMonday = winterMonday;
    },
    async updateShiftConfig() {
      const {
        data: { success, message }
      } = await EmployeeService.updateShiftConfig({
        type: "period",
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        config: {
          workday: this.workday,
          holiday: this.holiday,
          summerMonday: this.summerMonday,
          winterMonday: this.winterMonday
        }
      });
      this.getShiftConfig();
      this.$emit("notified", {
        text: utility.lookUpCustomMessage(message, this.loalocale.self.message),
        level: success ? "info" : "warning",
        visible: true,
        handler: () => {}
      });
    }
  }
};
</script>
<style>
</style>
