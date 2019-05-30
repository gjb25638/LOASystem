<template>
  <v-dialog max-width="350" v-model="dialog">
    <v-btn icon slot="activator">
      <v-icon class="flash" color="yellow">storage</v-icon>
    </v-btn>
    <v-card>
      <v-card-title class="theme">
        <span class="headline">資料庫管理</span>
      </v-card-title>
      <v-card-text>上次備份: {{content}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="dialog = false">關閉</v-btn>
        <v-btn class="theme" flat @click="backup">備份</v-btn>
        <v-btn class="theme" flat @click="restore">還原</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EmployeeService from "@/services/EmployeeService";
export default {
  name: "DatabaseManagement",
  props: {},
  data: () => ({
    dialog: false,
    content: ""
  }),
  mounted() {
    this.check();
  },
  methods: {
    backup() {
      const url = EmployeeService.downloadURL.dbbackup({
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.check();
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style = "display:none";
      document.body.appendChild(iframe);
    },
    async restore() {
      const {
        data: { success, message }
      } = await EmployeeService.dbrestore({
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.$emit("dbrestore", success, message);
    },
    async check() {
      const {
        data: { success, message, content }
      } = await EmployeeService.dbcheck({
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.content = content;
      this.$emit("dbcheck", success, message, content);
    }
  }
};
</script>
<style>
</style>
