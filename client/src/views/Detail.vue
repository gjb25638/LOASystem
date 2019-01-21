<template>
  <v-app id="detail">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md8>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs5>
                <v-text-field
                  prepend-icon="star_border"
                  v-model="employeeID"
                  :rules="employeeIDRules"
                  :label="this.localeConf.detail.input.employeeID"
                  required
                  :readonly="!fullControl"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs6>
                <v-select
                  prepend-icon="group"
                  v-model="dept"
                  :items="deptOptions"
                  :label="this.localeConf.detail.input.dept"
                  required
                  :readonly="!fullControl"
                ></v-select>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  prepend-icon="person"
                  v-model="name"
                  :rules="nameRules"
                  :label="this.localeConf.detail.input.name"
                  required
                  :readonly="!fullControl"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  :label="this.localeConf.detail.input.username"
                  required
                  :readonly="!fullControl"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-menu
                  :close-on-content-click="false"
                  v-model="datepickerMenu"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                  :disabled="!fullControl"
                >
                  <v-text-field
                    slot="activator"
                    v-model="arrivedDate"
                    :label="this.localeConf.detail.input.arrivedDate"
                    persistent-hint
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="arrivedDate"
                    no-title
                    @input="datepickerMenu = false"
                    scrollable
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs4>
                <v-select
                  prepend-icon="security"
                  v-model="level"
                  :items="['admin', 'manager', 'normal']"
                  :label="this.localeConf.detail.input.level"
                  required
                  :readonly="!fullControl"
                ></v-select>
              </v-flex>
              <v-flex xs3>
                <v-dialog v-model="resetPWDDialog" max-width="400px" v-if="isEditMode">
                  <v-btn slot="activator">
                    <v-icon>lock</v-icon>
                    {{localeConf.detail.btn.reset}}
                  </v-btn>
                  <v-card>
                    <v-card-title class="theme">
                      <span class="headline">{{localeConf.detail.btn.reset}}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-text-field
                        :append-icon="showingPassword ? 'visibility_off' : 'visibility'"
                        prepend-icon="lock"
                        name="password"
                        :label="localeConf.login.input.password"
                        :type="showingPassword ? 'text' : 'password'"
                        v-model="password"
                        @click:append="showingPassword = !showingPassword"
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="resetPWDDialog = false">{{localeConf.detail.dialog.close}}</v-btn>
                      <v-btn
                        class="theme"
                        flat
                        @click="resetPassword"
                      >{{localeConf.detail.btn.update}}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  v-model="selectedEmployees"
                  :items="employeeOptions"
                  :label="localeConf.detail.input.signers"
                  multiple
                  chips
                  :readonly="!fullControl"
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-divider></v-divider>
              </v-flex>
              <v-flex>
                <small>{{localeConf.detail.message.clickADateType}}:</small>
              </v-flex>
              <v-flex xs12>
                <v-list>
                  <v-list-tile avatar v-for="item in availableDateTypes" :key="item.index">
                    <v-list-tile-avatar>
                      <v-icon
                        :class="item.class"
                        @click="selectDateType($vuetify, item)"
                      >{{item.icon}}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content
                      :title="item.title + (item.countdown ? ' - ' + item.detail : '')"
                      @click="selectDateType($vuetify, item)"
                      style="cursor:pointer"
                    >
                      <v-list-tile-title>{{item.title}}</v-list-tile-title>
                      <v-list-tile-sub-title>{{item.countdown ? item.detail : ''}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-avatar v-if="fullControl || item.countdown">
                      <v-tooltip bottom>
                        <v-chip
                          slot="activator"
                          :class="item.enabled ? 'theme' : ''"
                          text-color="white"
                          @click="item.dialog = fullControl;"
                        >
                          <v-avatar :class="item.enabled ? 'theme' : ''">{{item.consumes.days}}</v-avatar>
                          {{item.totals.days}}
                        </v-chip>
                        <div>
                          <span>{{localeConf.detail.dialog.consumes}} {{item.consumes.days}} {{localeConf.detail.dialog.input.days}}</span>
                          <span
                            v-if="item.halfHoursEnabled"
                          >{{item.consumes.hours}} {{localeConf.detail.dialog.input.hours}}</span>
                        </div>
                        <div>
                          <span>{{localeConf.detail.dialog.totals}} {{item.totals.days}} {{localeConf.detail.dialog.input.days}}</span>
                          <span
                            v-if="item.halfHoursEnabled"
                          >{{item.totals.hours}} {{localeConf.detail.dialog.input.hours}}</span>
                        </div>
                        <div
                          v-if="item.deadline"
                        >{{localeConf.detail.dialog.deadline}} {{item.deadline}}</div>
                      </v-tooltip>
                    </v-list-tile-avatar>
                    <v-list-tile-action v-if="fullControl">
                      <v-btn icon ripple @click="item.enabled = !item.enabled">
                        <v-icon
                          :class="item.enabled ? 'green--text' : ''"
                        >{{item.enabled ? 'done' : 'add'}}</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                    <v-dialog v-model="item.dialog" max-width="400px">
                      <v-card>
                        <v-card-title>
                          <h2>{{localeConf.detail.dialog.consumes}}</h2>
                        </v-card-title>
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex xs5>
                              <v-text-field
                                type="number"
                                min="0"
                                :label="localeConf.detail.dialog.input.days"
                                v-model="item.consumes.days"
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs2>
                              <v-checkbox
                                v-if="item.isCustomizedType"
                                v-model="item.halfHoursEnabled"
                              ></v-checkbox>
                            </v-flex>
                            <v-flex xs5>
                              <v-text-field
                                :disabled="!item.halfHoursEnabled"
                                type="number"
                                min="0"
                                max="15"
                                :label="localeConf.detail.dialog.input.hours"
                                v-model="item.consumes.hours"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                        <v-card-title primary-title>
                          <h2>{{localeConf.detail.dialog.totals}}</h2>
                        </v-card-title>
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex xs5>
                              <v-text-field
                                type="number"
                                min="0"
                                :label="localeConf.detail.dialog.input.days"
                                v-model="item.totals.days"
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs2></v-flex>
                            <v-flex xs5>
                              <v-text-field
                                :disabled="!item.halfHoursEnabled"
                                type="number"
                                min="0"
                                max="15"
                                :label="localeConf.detail.dialog.input.hours"
                                v-model="item.totals.hours"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex xs6>
                              <v-menu
                                :close-on-content-click="false"
                                v-model="item.datepicker"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                              >
                                <v-text-field
                                  slot="activator"
                                  v-model="item.deadline"
                                  :label="localeConf.detail.dialog.deadline"
                                  persistent-hint
                                  prepend-icon="event"
                                  readonly
                                ></v-text-field>
                                <v-date-picker
                                  v-model="item.deadline"
                                  no-title
                                  @input="item.datepicker = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            class="theme"
                            @click="item.dialog=false"
                          >{{localeConf.detail.dialog.close}}</v-btn>
                          <v-btn
                            v-if="item.isCustomizedType"
                            class="theme"
                            @click="dateTypes = dateTypes.filter((e) => e.index !== item.index)"
                          >remove</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-list-tile>
                  <v-list-tile avatar v-if="fullControl">
                    <v-list-tile-avatar>
                      <v-icon :class="['brown', 'darken-1', 'white--text']">event</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-text-field
                        :label="this.localeConf.detail.input.others"
                        v-model="customTypeName"
                      ></v-text-field>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-tooltip bottom>
                        <v-btn icon ripple @click="addDateType" class="theme" slot="activator">
                          <v-icon>open_in_browser</v-icon>
                        </v-btn>
                        <div>{{localeConf.detail.btn.import}}</div>
                      </v-tooltip>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex>
                <v-expansion-panel dark>
                  <v-expansion-panel-content>
                    <div slot="header">
                      {{ localeConf.detail.message.unavailableDateTypes }}
                      ({{ localeConf.detail.message.unavailableDateTypesDetails }})
                    </div>
                    <v-list>
                      <v-list-tile avatar v-for="item in unavailableDateTypes" :key="item.index">
                        <v-list-tile-avatar>
                          <v-icon
                            :class="item.class"
                            @click="selectDateType($vuetify, item)"
                          >{{item.icon}}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content
                          :title="item.title + (item.countdown ? ' - ' + item.detail : '')"
                          @click="selectDateType($vuetify, item)"
                          style="cursor:pointer"
                        >
                          <v-list-tile-title>{{item.title}}</v-list-tile-title>
                          <v-list-tile-sub-title>{{item.countdown ? item.detail : ''}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-avatar v-if="fullControl || item.countdown">
                          <v-tooltip bottom>
                            <v-chip
                              slot="activator"
                              :class="item.enabled ? 'theme' : ''"
                              text-color="white"
                              @click="item.dialog = fullControl;"
                            >
                              <v-avatar :class="item.enabled ? 'theme' : ''">{{item.consumes.days}}</v-avatar>
                              {{item.totals.days}}
                            </v-chip>
                            <div>
                              <span>{{localeConf.detail.dialog.consumes}} {{item.consumes.days}} {{localeConf.detail.dialog.input.days}}</span>
                              <span
                                v-if="item.halfHoursEnabled"
                              >{{item.consumes.hours}} {{localeConf.detail.dialog.input.hours}}</span>
                            </div>
                            <div>
                              <span>{{localeConf.detail.dialog.totals}} {{item.totals.days}} {{localeConf.detail.dialog.input.days}}</span>
                              <span
                                v-if="item.halfHoursEnabled"
                              >{{item.totals.hours}} {{localeConf.detail.dialog.input.hours}}</span>
                            </div>
                            <div
                              v-if="item.deadline"
                            >{{localeConf.detail.dialog.deadline}} {{item.deadline}}</div>
                          </v-tooltip>
                        </v-list-tile-avatar>
                        <v-list-tile-action v-if="fullControl">
                          <v-btn icon ripple @click="item.enabled = !item.enabled">
                            <v-icon
                              :class="item.enabled ? 'green--text' : ''"
                            >{{item.enabled ? 'done' : 'add'}}</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                        <v-dialog v-model="item.dialog" max-width="400px">
                          <v-card>
                            <v-card-title>
                              <h2>{{localeConf.detail.dialog.consumes}}</h2>
                            </v-card-title>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex xs5>
                                  <v-text-field
                                    type="number"
                                    min="0"
                                    :label="localeConf.detail.dialog.input.days"
                                    v-model="item.consumes.days"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs2>
                                  <v-checkbox
                                    v-if="item.isCustomizedType"
                                    v-model="item.halfHoursEnabled"
                                  ></v-checkbox>
                                </v-flex>
                                <v-flex xs5>
                                  <v-text-field
                                    :disabled="!item.halfHoursEnabled"
                                    type="number"
                                    min="0"
                                    max="15"
                                    :label="localeConf.detail.dialog.input.hours"
                                    v-model="item.consumes.hours"
                                  ></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                            <v-card-title primary-title>
                              <h2>{{localeConf.detail.dialog.totals}}</h2>
                            </v-card-title>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex xs5>
                                  <v-text-field
                                    type="number"
                                    min="0"
                                    :label="localeConf.detail.dialog.input.days"
                                    v-model="item.totals.days"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs5>
                                  <v-text-field
                                    :disabled="!item.halfHoursEnabled"
                                    type="number"
                                    min="0"
                                    max="15"
                                    :label="localeConf.detail.dialog.input.hours"
                                    v-model="item.totals.hours"
                                  ></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex xs6>
                                  <v-menu
                                    :close-on-content-click="false"
                                    v-model="item.datepicker"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    max-width="290px"
                                    min-width="290px"
                                  >
                                    <v-text-field
                                      slot="activator"
                                      v-model="item.deadline"
                                      :label="localeConf.detail.dialog.deadline"
                                      persistent-hint
                                      prepend-icon="event"
                                      readonly
                                    ></v-text-field>
                                    <v-date-picker
                                      v-model="item.deadline"
                                      no-title
                                      @input="item.datepicker = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                class="theme"
                                @click="item.dialog=false"
                              >{{localeConf.detail.dialog.close}}</v-btn>
                              <v-btn
                                v-if="item.isCustomizedType"
                                class="theme"
                                @click="dateTypes = dateTypes.filter((e) => e.index !== item.index)"
                              >remove</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-tile>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
              <v-flex xs12>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12>
                <v-card id="apply">
                  <v-toolbar :class="selectedDateType.class">
                    <h3>{{selectedDateType.title}}</h3>
                    <v-spacer></v-spacer>
                    <v-icon
                      :class="selectedDateType.class"
                      :title="selectedDateType.title"
                    >{{selectedDateType.icon}}</v-icon>
                  </v-toolbar>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-dialog
                          :disabled="!selectedDateType.title"
                          ref="dateDialog"
                          :close-on-content-click="false"
                          v-model="dateDialog"
                          lazy
                          width="290px"
                          persistent
                        >
                          <v-combobox
                            slot="activator"
                            v-model="apply.dates"
                            multiple
                            chips
                            small-chips
                            :label="localeConf.detail.input.leaveDates"
                            readonly
                          ></v-combobox>
                          <v-date-picker
                            :allowed-dates="allowedDates"
                            v-model="apply.dates"
                            multiple
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              flat
                              class="theme"
                              @click="checkDates($refs.dateDialog, 'dates')"
                            >OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex
                        v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1"
                        xs2
                      >
                        <v-dialog
                          ref="startFromDialog"
                          :close-on-content-click="false"
                          v-model="startFromDialog"
                          lazy
                          width="290px"
                          persistent
                        >
                          <v-text-field
                            slot="activator"
                            v-model="apply.startFrom"
                            :label="localeConf.detail.input.from"
                            prepend-icon="access_time"
                          ></v-text-field>
                          <v-time-picker
                            v-model="apply.startFrom"
                            format="24hr"
                            :allowed-hours="allowedHours"
                            :allowed-minutes="allowedMinutes"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              flat
                              class="theme"
                              @click="calculateTotalTime($refs.startFromDialog, 'startFrom')"
                            >OK</v-btn>
                          </v-time-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex
                        v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1"
                        xs2
                      >
                        <v-dialog
                          ref="endToDialog"
                          :close-on-content-click="false"
                          v-model="endToDialog"
                          lazy
                          width="290px"
                          persistent
                        >
                          <v-text-field
                            slot="activator"
                            v-model="apply.endTo"
                            :label="localeConf.detail.input.to"
                          ></v-text-field>
                          <v-time-picker
                            v-model="apply.endTo"
                            format="24hr"
                            :allowed-hours="allowedHours"
                            :allowed-minutes="allowedMinutes"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              flat
                              class="theme"
                              @click="calculateTotalTime($refs.endToDialog, 'endTo')"
                            >OK</v-btn>
                          </v-time-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex
                        v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1"
                        xs1
                      >
                        <v-btn icon ripple @click="clearStartFromEndTo">
                          <v-icon size="16">clear</v-icon>
                        </v-btn>
                      </v-flex>
                      <v-flex
                        v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1"
                        xs4
                      ></v-flex>
                      <v-flex
                        v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1"
                        xs1
                      >
                        <v-text-field
                          v-model="apply.totalHours"
                          :label="localeConf.detail.input.totals"
                          readonly
                        ></v-text-field>
                      </v-flex>
                      <v-flex
                        v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1"
                        xs2
                      >
                        <v-text-field :value="localeConf.detail.input.hours" readonly></v-text-field>
                      </v-flex>
                      <v-flex xs2>
                        <v-text-field
                          :disabled="!selectedDateType.title"
                          :label="localeConf.detail.input.agent"
                          v-model="apply.agent"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-btn @click="takeALeave" class="theme">
                          <v-icon>move_to_inbox</v-icon>
                          {{localeConf.detail.btn.leave}}
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex>
                <v-list>
                  <v-list-tile avatar v-for="item in records" :key="item.index">
                    <v-list-tile-avatar>
                      <v-icon :class="item.class">{{item.icon}}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.title}}</v-list-tile-title>
                      <v-list-tile-sub-title>{{combineDatesContent(item.apply.dates, item.apply.startFrom, item.apply.endTo, item.apply.totalHours)}}</v-list-tile-sub-title>
                      <v-list-tile-sub-title
                        v-if="item.apply.agent"
                      >{{combineAgentContent(item.apply.agent)}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-avatar v-if="fullControl || item.countdown">
                      <v-tooltip bottom>
                        <v-chip
                          slot="activator"
                          class="theme"
                          text-color="white"
                        >{{item.apply.remainings.days}}</v-chip>
                        <span>{{localeConf.detail.dialog.remainings}} {{item.apply.remainings.days}} {{localeConf.detail.dialog.input.days}}</span>
                        <span
                          v-if="item.halfHoursEnabled"
                        >{{item.apply.remainings.hours}} {{localeConf.detail.dialog.input.hours}}</span>
                        <br>
                        <span>{{localeConf.detail.dialog.deadline}} {{item.deadline}}</span>
                      </v-tooltip>
                    </v-list-tile-avatar>
                    <v-list-tile-avatar>
                      <v-btn icon ripple @click="removeALeave(item)">
                        <v-icon size="16">clear</v-icon>
                      </v-btn>
                    </v-list-tile-avatar>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  :class="['theme', 'float-right']"
                  @click="submit"
                  v-if="fullControl"
                >{{isEditMode ? localeConf.detail.btn.update: localeConf.detail.btn.create}}</v-btn>
                <v-btn
                  :class="records.length == 0 ? ['float-right'] : ['theme', 'float-right']"
                  @click="save"
                  v-if="isEditMode"
                  :disabled="records.length == 0"
                >{{localeConf.detail.btn.save}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" color="error" :multi-line="true" :timeout="3000">
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar = false">X</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import EmployeeService from "@/services/EmployeeService";
import defaultConf from "@/default.js";
import utility from "@/utility.js";
export default {
  name: "Detail",
  data: () => ({
    snackbar: false,
    snackbarText: "",
    valid: true,
    employeeID: "",
    employeeIDRules: [v => true],
    dept: defaultConf.deptOptions[0],
    name: "",
    nameRules: [v => true],
    username: "",
    usernameRules: [v => true],
    arrivedDate: "",
    level: "normal",
    deptOptions: defaultConf.deptOptions,
    datepickerMenu: false,
    customTypeName: "",
    dateTypes: JSON.parse(JSON.stringify(defaultConf.dateTypes)),
    isEditMode: false,
    fullControl: true,
    resetPWDDialog: false,
    password: "",
    showingPassword: false,
    selectedDateType: {},
    dateDialog: false,
    startFromDialog: false,
    endToDialog: false,
    records: [],
    apply: {
      created: null,
      startFrom: null,
      endTo: null,
      dates: [],
      totalHours: 0,
      agent: "",
      remainings: {
        days: 0,
        hours: 0
      }
    },
    selectedEmployees: [],
    employees: [],
    employeeOptions: []
  }),
  computed: {
    availableDateTypes: function() {
      return this.dateTypes.filter(dt => {
        return !(
          dt.name.startsWith(this.localeConf.report.th.compensatory) &&
          dt.consumes.days === dt.totals.days &&
          dt.consumes.halfHours === dt.totals.halfHours &&
          utility.formatDate(dt.deadline) <= utility.formatDate("now")
        );
      });
    },
    unavailableDateTypes: function() {
      return this.dateTypes.filter(dt => {
        return (
          dt.name.startsWith(this.localeConf.report.th.compensatory) &&
          dt.consumes.days === dt.totals.days &&
          dt.consumes.halfHours === dt.totals.halfHours &&
          utility.formatDate(dt.deadline) <= utility.formatDate("now")
        );
      });
    }
  },
  beforeCreate() {
    utility.checkingLoginStatus(this.$cookie, this.$router);
  },
  created() {
    this.arrivedDate = utility.formatDate("now");
    this.apply.created = new Date(utility.formatDate("now"));
    this.apply.dates = [];
    this.employeeIDRules = [
      v => !!v || this.localeConf.detail.message.employeeIDRules
    ];
    this.nameRules = [v => !!v || this.localeConf.detail.message.nameRules];
    this.usernameRules = [
      v => !!v || this.localeConf.detail.message.usernameRules
    ];
  },
  mounted() {
    this.isEditMode = this.$route.params.id && this.$route.params.id !== "new";
    if (this.isEditMode) {
      this.getEmployee();
    }
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      const {
        data: { employees }
      } = await EmployeeService.fetch({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });
      this.employeeOptions = employees
        .filter(e => e.username !== this.username)
        .map(e => `${e.dept} - ${e.name} (${e.username})`);
      this.employees = employees.filter(e => e.username !== this.username);
    },
    async getEmployee() {
      const {
        data: {
          employeeID,
          dept,
          name,
          username,
          arrivedDate,
          level,
          signers,
          activatedDateTypes,
          fullControl
        }
      } = await EmployeeService.get({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id
      });
      this.employeeID = employeeID;
      this.dept = dept;
      if (!this.dept) {
        this.dept = this.deptOptions[0];
      }
      this.name = name;
      this.username = username;
      this.arrivedDate = arrivedDate
        ? utility.formatDate(arrivedDate)
        : utility.formatDate("now");
      this.level = level;
      this.fullControl = fullControl;
      if (activatedDateTypes.length > 0) {
        this.updateDateTypes(activatedDateTypes);
      }
      this.selectedEmployees = signers.map(
        other => `${other.dept} - ${other.name} (${other.username})`
      );
    },
    async save() {
      const records = this.records.map(r => {
        return {
          appliedDate: r.apply.created,
          startFrom: r.apply.startFrom,
          endTo: r.apply.endTo,
          dateType: r.name,
          dates: r.apply.dates.map(d => new Date(d)),
          agent: r.apply.agent,
          signings: [],
          totals: {
            days: r.apply.totalHours === 0 ? r.apply.dates.length : 0,
            halfHours: r.apply.totalHours * 2
          }
        };
      });
      const response = await EmployeeService.updateLOA({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id,
        records: records,
        activatedDateTypes: this.dateTypes.map(dt => {
          return Object.assign({}, dt, {
            consumes: {
              days: dt.consumes.days,
              halfHours: dt.consumes.hours * 2
            },
            totals: {
              days: dt.totals.days,
              halfHours: dt.totals.hours * 2
            }
          });
        })
      });

      if (response.data.success) {
        this.$router.push({ name: "List" });
      } else {
        this.snackbar = true;
        this.snackbarText = response.data.message;
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        const employees = this.employees;
        const params = {
          employeeID: this.employeeID,
          dept: this.dept,
          name: this.name,
          username: this.username,
          arrivedDate: this.arrivedDate,
          level: this.level,
          activatedDateTypes: this.dateTypes.map(dt => {
            return Object.assign({}, dt, {
              consumes: {
                days: dt.consumes.days,
                halfHours: dt.consumes.hours * 2
              },
              totals: {
                days: dt.totals.days,
                halfHours: dt.totals.hours * 2
              }
            });
          }),
          loginuser: this.$cookie.get("loginuser"),
          token: this.$cookie.get("token"),
          id: this.$route.params.id,
          signers: this.selectedEmployees
            .map(str => {
              const [
                ,
                dept,
                name,
                username
              ] = /(.*?)\s-\s(.*?)\s\((.*?)\)/.exec(str);
              if (dept && name && username) {
                const employee = employees.find(e => e.username === username);
                if (employee) {
                  return {
                    id: employee._id,
                    dept: employee.dept,
                    name: employee.name,
                    username: employee.username,
                    level: employee.level
                  };
                }
              }
            })
            .filter(e => e)
        };
        let response;
        if (this.isEditMode) {
          response = await EmployeeService.update(params);
        } else {
          response = await EmployeeService.add(params);
        }

        if (response.data.success) {
          this.$router.push({ name: "List" });
        } else {
          this.snackbar = true;
          this.snackbarText = response.data.message;
        }
      }
    },
    updateDateTypes(dateTypes) {
      dateTypes.forEach(dt => {
        const dateType = this.dateTypes.find(dt2 => dt2.name === dt.name);
        if (dateType) {
          dateType.enabled = dt.enabled;
          dateType.consumes = {
            days: dt.consumes.days,
            hours: dt.consumes.halfHours ? dt.consumes.halfHours / 2 : 0
          };
          dateType.totals = {
            days: dt.totals.days,
            hours: dt.totals.halfHours ? dt.totals.halfHours / 2 : 0
          };
          dateType.deadline = dt.deadline
            ? utility.formatDate(dt.deadline)
            : null;
        } else {
          this.dateTypes.push(
            Object.assign({}, defaultConf.customDateType, {
              index: this.dateTypes.length,
              enabled: true,
              title: dt.name,
              name: dt.name,
              consumes: {
                days: dt.consumes.days,
                hours: dt.consumes.halfHours ? dt.consumes.halfHours / 2 : 0
              },
              totals: {
                days: dt.totals.days,
                hours: dt.totals.halfHours ? dt.totals.halfHours / 2 : 0
              },
              deadline: dt.deadline ? utility.formatDate(dt.deadline) : null
            })
          );
        }
      });
      if (!this.fullControl) {
        this.dateTypes = this.dateTypes.filter(dt => dt.enabled);
      }
    },
    addDateType() {
      if (this.customTypeName) {
        this.dateTypes.push(
          Object.assign(
            {},
            JSON.parse(JSON.stringify(defaultConf.customDateType)),
            {
              index: this.dateTypes.length,
              title: this.customTypeName,
              name: this.customTypeName
            }
          )
        );
      }
    },
    takeALeave() {
      if (this.apply.dates.length === 0) {
        return;
      }

      if (
        (this.selectedDateType.consumes.days + this.apply.dates.length >
          this.selectedDateType.totals.days &&
          this.selectedDateType.consumes.hours ===
            this.selectedDateType.totals.hours) ||
        (this.selectedDateType.totals.days === 0 && this.apply.totalHours === 0)
      ) {
        this.snackbar = true;
        this.snackbarText = this.localeConf.detail.message.runOutQotaOfLeave;
        return;
      }

      if (this.selectedDateType.halfHoursEnabled) {
        this.selectedDateType.consumes.days +=
          this.apply.totalHours === 0 ? this.apply.dates.length : 0;
        this.selectedDateType.consumes.hours += this.apply.totalHours;

        if (this.selectedDateType.consumes.hours >= 8) {
          this.selectedDateType.consumes.days++;
          this.selectedDateType.consumes.hours -= 8;
        }
        const result =
          this.selectedDateType.totals.days * 8 +
          this.selectedDateType.totals.hours -
          this.selectedDateType.consumes.days * 8 -
          this.selectedDateType.consumes.hours;
        this.apply.remainings.days = Math.floor(result / 8);
        this.apply.remainings.hours = result % 8;
      } else {
        this.selectedDateType.consumes.days += this.apply.dates.length;
        this.apply.remainings.days =
          this.selectedDateType.totals.days -
          this.selectedDateType.consumes.days;
      }

      this.records.push(
        Object.assign({}, this.selectedDateType, {
          apply: Object.assign({}, this.apply),
          index:
            this.records.length > 0
              ? this.records[this.records.length - 1].index + 1
              : 0
        })
      );

      this.apply = {
        created: new Date(utility.formatDate("now")),
        startFrom: null,
        endTo: null,
        dates: [utility.formatDate("now")],
        totalHours: 0,
        agent: "",
        remainings: {
          days: 0,
          hours: 0
        }
      };
    },
    selectDateType($vuetify, dateType) {
      $vuetify.goTo("#apply", {
        duration: 500,
        offset: 0,
        easing: "easeInOutCubic"
      });
      this.selectedDateType = dateType;
      this.apply = {
        created: new Date(utility.formatDate("now")),
        startFrom: null,
        endTo: null,
        dates: [],
        totalHours: 0,
        agent: "",
        remainings: {
          days: 0,
          hours: 0
        }
      };
    },
    allowedDates(d) {
      const date = new Date(d);
      const annualPreRequest = this.dateTypes.find(
        dt => dt.name === "annualPreRequest"
      );
      const annual = this.dateTypes.find(dt => dt.name === "annual");
      if (
        annual &&
        annualPreRequest &&
        this.selectedDateType.name === annualPreRequest.name
      ) {
        return new Date(annual.deadline) < date;
      } else {
        return true;
      }
    },
    allowedHours: h => h >= 7 && h <= 23,
    allowedMinutes: m => m % 30 === 0,
    calculateTotalTime(dialog, target) {
      dialog.save(this.apply[target]);
      this.apply.totalHours = utility.calculateTotalHours(
        this.apply.startFrom,
        this.apply.endTo
      );
      if (this.apply.totalHours === -1) {
        this.apply.totalHours = 0;
        this.apply.endTo = this.apply.startFrom = null;
      }
    },
    checkDates(dialog, target) {
      this.apply[target] = this.apply[target].slice(0, 5).sort();
      dialog.save(this.apply[target]);
    },
    clearStartFromEndTo() {
      this.apply.startFrom = null;
      this.apply.endTo = null;
      this.apply.totalHours = 0;
    },
    combineDatesContent(dates, startFrom, endTo, totalHours) {
      if (dates.length > 1) {
        return dates.join(", ");
      } else {
        if (startFrom && endTo) {
          return `${dates[0]} - ${startFrom} ~ ${endTo} (${totalHours} ${
            this.localeConf.detail.dialog.input.hours
          })`;
        } else {
          return dates[0];
        }
      }
    },
    combineAgentContent(agent) {
      return agent ? `${this.localeConf.detail.input.agent}: ${agent}` : "";
    },
    async resetPassword() {
      this.resetPWDDialog = false;
      const response = await EmployeeService.updatePWD({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id,
        password: this.password
      });

      if (response.data.success) {
        this.$cookie.delete("loginuser");
        this.$cookie.delete("token");
        this.$router.push({ name: "Login" });
      } else {
        this.snackbar = true;
        this.snackbarText = response.data.message;
      }
    },
    removeALeave(target) {
      const record = this.records.find(r => r.index === target.index);
      const dateType = this.dateTypes.find(dt => dt.name === record.name);
      if (record.apply.totalHours === 0) {
        dateType.consumes.days -= record.apply.dates.length;
      } else {
        let consumeHours = dateType.consumes.days * 8 + dateType.consumes.hours;
        consumeHours -= record.apply.totalHours;
        dateType.consumes.days = Math.floor(consumeHours / 8);
        dateType.consumes.hours = consumeHours % 8;
      }
      this.records = this.records.filter(r => r.index !== target.index);
    }
  }
};
</script>
<style lang="scss" scoped>
.theme {
  background: linear-gradient(
    to right,
    rgba(225, 56, 89, 1) 0%,
    rgba(195, 43, 127, 1) 35%,
    rgba(146, 49, 140, 1) 65%,
    rgba(78, 56, 130, 1) 100%
  ) !important;
  color: white !important;
}
.float-right {
  float: right;
}
</style>
