<template>
  <system-notification v-model="systemNotification" @close="close">
    <tbody>
      <tr v-for="info in infos" :key="info.name">
        <td>
          <v-icon :class="[info.iconNClass.class, 'circle-icon']">{{info.iconNClass.icon}}</v-icon>
        </td>
        <td class="min-width-100">{{info.localeName}}</td>
        <td>
          <span
            v-if="fullControl || isLeaveTypeInfoGeneral(info.name)"
          >{{stringFormat(loalocale.self.stringTemplate.totals, info.totals)}}</span>
        </td>
        <td>{{stringFormat(loalocale.self.stringTemplate.deadline, info.deadline)}}</td>
      </tr>
    </tbody>
  </system-notification>
</template>

<script>
import SystemNotification from "@/components/SystemNotification";
import utility from "@/utility.js";
export default {
  name: "LeaveTypeRefreshedNotification",
  components: {
    "system-notification": SystemNotification
  },
  props: {
    leaveTypes: {
      type: Array,
      default: () => []
    },
    fullControl: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  computed: {
    infos() {
      return this.leaveTypes.map((lt, index) => ({
        index,
        name: lt.name,
        localeName: this.loalocale.shared.leaveTypes[lt.name],
        deadline: utility.formatDate(lt.deadline),
        totals: lt.totals.days,
        iconNClass: utility.lookUpLeaveTypeIconNClass(lt.name)
      }));
    },
    systemNotification() {
      return {
        level: "info",
        title: this.loalocale.self.title,
        visible: this.value
      };
    }
  },
  data: () => ({}),
  methods: {
    close: function() {
      this.$emit("close");
    },
    stringFormat: utility.stringFormat,
    isLeaveTypeInfoGeneral: utility.isLeaveTypeInfoGeneral
  }
};
</script>

<style scoped>
.circle-icon {
  border-radius: 12px;
}
</style>
