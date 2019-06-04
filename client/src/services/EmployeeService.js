import Api from "@/services/Api";
import config from "@/services/config";

export default {
  getAnnualReport(params) {
    const url = `annual/report/${params.year}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  getMonthlyReport(params) {
    const url = `monthly/report/${params.year}/${params.month}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  getAnnual(params) {
    const url = `annual/${params.year}/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  getMonthly(params) {
    const url = `monthly/${params.sdehsra ? "sdehsra/" : ""}${params.year}/${
      params.month
    }/${params.loginuser}/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  auth(params) {
    return Api().post("auth", params);
  },
  authForLightweight(params) {
    const url = `auth/lightweight/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  fetch(params) {
    const url = `employees/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  fetchForLightweight(params) {
    const url = `employees/lightweight/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  add(params) {
    const url = `employee/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().post(url, params);
  },
  update(params) {
    const url = `employee/${params.id}/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url, params);
  },
  updateLOA(params) {
    const url = `employee/loa/${params.id}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url, params);
  },
  updatePWD(params) {
    const url = `employee/pwd/${params.id}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url, params);
  },
  updateEmail(params) {
    const url = `employee/email/${params.id}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url, params);
  },
  updateSign(params) {
    const url = `employee/sign/${params.id}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url, params);
  },
  get(params) {
    const url = `employee/${params.id}/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  delete(params) {
    const url = `employee/${params.id}/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().delete(url);
  },
  toggle(params) {
    const url = `toggle/${params.id}/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url);
  },
  compensatory(params) {
    const url = `employees/compensatory/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  dbrestore(params) {
    const url = `db/restore/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  dbcheck(params) {
    const url = `db/check/${params.loginuser}/${encodeURIComponent(
      params.token
    )}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  getShifts(params) {
    const url = `shift/${params.year}/${params.month}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  updateShift(params) {
    const url = `shift/${params.shiftId ? "delete" : "new"}/${params.id}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().post(url, params);
  },
  getShiftConfig(params) {
    const url = `shift/config/${params.type}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  getHoliday(params) {
    const url = `holiday/${params.year}/${params.month}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().get(url);
  },
  updateShiftConfig(params) {
    const url = `shift/config/${params.type}/${
      params.loginuser
    }/${encodeURIComponent(params.token)}`;
    devlog(`${config.API_URL}/${url}`);
    return Api().put(url, params);
  },
  downloadURL: {
    exportReport(params) {
      let url;
      if (params.period === "annual") {
        url = `${config.API_URL}/${params.period}/export/report/${
          params.year
        }/${params.loginuser}/${encodeURIComponent(params.token)}`;
      } else if (params.period === "monthly") {
        url = `${config.API_URL}/${params.period}/export/report/${
          params.year
        }/${params.month}/${params.loginuser}/${encodeURIComponent(
          params.token
        )}`;
      }
      devlog(url);
      return url;
    },
    exportShift(params) {
      let url;
      url = `${config.API_URL}/shift/export/${params.year}/${params.month}/${
        params.loginuser
      }/${encodeURIComponent(params.token)}`;
      devlog(url);
      return url;
    },
    dbbackup(params) {
      const url = `${config.API_URL}/db/backup/${
        params.loginuser
      }/${encodeURIComponent(params.token)}`;
      devlog(url);
      return url;
    }
  }
};

function devlog(msg) {
  if (config.dev) {
    console.log(msg);
  }
}
