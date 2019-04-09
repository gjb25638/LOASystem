export default {
    en: {
        leaveTypesDetail: "Leave Types Details",
        title: "",
        otherInfos: "",
        leaveTypes: {
            officialHoliday: {
                name: "Official Holiday",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" },
            },
            nationalHoliday: {
                name: "National Holiday",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            annual: {
                name: "Annual Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            personal: {
                name: "Personal Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            familyCare: {
                name: "family care leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            sick: {
                name: "Sickness Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            menstrual: {
                name: "Menstrual Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            marriage: {
                name: "Marriage Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            manternityMiscarriage: {
                name: "Manternity/Miscarriage Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            preManternity: {
                name: "pre-manternity leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            accompanyingManternity: {
                name: "Accompanying Manternity Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            funeral: {
                name: "Funeral Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            occpationalSick: {
                name: "Occpational Sickness Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            official: {
                name: "Official Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            parentalUnpaid: {
                name: "Parental Unpaid Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            jobSeeking: {
                name: "Job Seeking Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            businessTrip: {
                name: "Business-trip Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            annualPreRequest: {
                name: "Pre-request Annual Leave",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            }
        }
    },
    zh: {
        leaveTypesDetail: "所有假別詳細說明",
        title: "適用勞基法人員請假規則簡表(107.8月)",
        otherInfos: [
            "1、本表係依勞動基準法、勞工請假規則、性別工作平等法及其施行細則編製。",
            "2、婚假以1次給足為原則；喪假，如因禮俗原因，得於百日內申請分次給假。",
            "3、事假、普通傷病假、婚假、喪假期間，除延長假期在1個月以上者外，如遇例假、休假（紀念日），應不計入請假期內。",
            "4、事假(家庭照顧假) 、普通傷病假(生理假)以時為單位；婚假、喪假、陪產假及特別休假以日為單位。"
        ],
        leaveTypes: {
            officialHoliday: {
                name: "例假",
                granted: "",
                detailInfo: "勞工每7日中應有2日之休息，其中1日為例假，1日為休息日。",
                others: {
                    paidInfo: "",
                    reference: "勞動基準法第36條"
                }
            },
            nationalHoliday: {
                name: "國定假日",
                granted: "",
                detailInfo: "內政部所定應放假之紀念日、節日、勞動節及其他中央主管機關指定應放假之日。",
                others: {
                    paidInfo: "",
                    reference: "勞動基準法第37條"
                }
            },
            annual: {
                name: "特別休假",
                granted: ["公司(法規)", "10天(3天)", "11天(7天)", "12天(10天)", "14天(14天)", "15-19天(15天)", "20~30天(16~30天)"],
                detailInfo: [
                    "員工在同一事業單位繼續工作滿一定期間者，應給予特別休假",
                    "6個月至未滿1年",
                    "工作1年以上未滿2年",
                    "工作2年以上未滿3年",
                    "工作3年以上未滿5年",
                    "工作5年以上未滿10年",
                    "服務滿10年以上，每年加給1日，加至30日止。",
                ],
                others: {
                    paidInfo: "工資照給。(不扣全勤)",
                    reference: "勞動基準法第38條"
                }
            },
            personal: {
                name: "事假",
                granted: "14日(全年)",
                detailInfo: [
                    "1、因有事故必須親自處理者。",
                    "2、須親自辦理請假程序，經核准後始得離開。",
                    "3、緊急事故得由同事或家屬親友代辦請假手續。"],
                others: {
                    paidInfo: "不給工資。(扣全勤) 按日扣除薪資。",
                    reference: "勞工請假規則第7條"
                }
            },
            familyCare: {
                name: "家庭照顧假",
                granted: "7日(全年)",
                detailInfo: "家庭成員預防接種、發生嚴重之疾病或其他重大事故須親自照顧時，得請家庭照顧假，其請假日數併入事假計算。受僱者之配偶未就業者，不適用規定。",
                others: {
                    paidInfo: "不給工資。(不扣全勤) 按日扣除薪資。",
                    reference: "性別工作平等法第二十條"
                }
            },
            sick: {
                name: "普通傷病假",
                granted: "30日(全年)",
                detailInfo: [
                    "因疾病必須治療或休養者。二日以上之病假，應檢具合法醫療機構或醫師證明書。經醫師診斷，罹患癌症（含原位癌）採門診方式治療或懷孕期間需安胎休養者，其治療或休養期間，併入住院傷病假計算。",
                    "1、未住院者，1年內合計不得超過30日。",
                    "2、住院者，2年內合計不得超過1年。",
                    "3、未住院傷病假與住院傷病假2年內合計不得超過1年。",
                    "超過上開規定之期限，經以事假或特別休假抵充後仍未痊癒者，得予留職停薪，但以1年為限。"
                ],
                others: {
                    paidInfo: "1年內未超過30日部分，工資折半發給；超過30日部分，應按日扣除薪資。領有勞工保險普通傷病給付未達工資半數者，由雇主補足之。(扣全勤)",
                    reference: "勞工請假規則第4條"
                }
            },
            menstrual: {
                name: "生理假",
                granted: "每月1日",
                detailInfo: "女性員工因生理日致工作有困難者，每月得請生理假1日，其請假日數併入病假計算。",
                others: {
                    paidInfo: "全年請假日數未逾3日，不併入病假計算，其餘日數併入病假計算。薪資減半發給。(不扣全勤)",
                    reference: "性別工作平等法第十四條"
                }
            },
            marriage: {
                name: "婚假",
                granted: "8日",
                detailInfo: [
                    "1、 結婚事實。",
                    "2、 附有喜帖或結婚證書影本。",
                    "3、 自登記結婚之日前10日起3個月內請畢，但經雇主同意者，得於1年內請畢。"
                ],
                others: {
                    paidInfo: "工資照給。(不扣全勤)",
                    reference: "勞工請假規則第2條"
                }
            },
            manternityMiscarriage: {
                name: "產假(含流產假)",
                granted: [
                    "8星期",
                    "4星期",
                    "1星期",
                    "5日"
                ],
                detailInfo: [
                    [
                        "1、因分娩者。",
                        "2、須呈合法醫療機構醫師證明書。",
                        "3、分娩假不扣除例假日，應一次請畢，不得保留。"
                    ],
                    "妊娠3個月以上流產者，流產假不扣除例假日並應一次請畢。須   附合法醫療機構醫師證明書。",
                    "妊娠2個月以上未滿3個月流產者，不扣除例假日並應一次請畢。須   附合法醫療機構醫師證明書。",
                    "妊娠未滿2個月流產者，不扣除例假日並應一次請畢。須   附合法醫療機構醫師證明書。"
                ],
                others: {
                    paidInfo: "女性員工受僱工作在6個月以上者，停止工作期間工資照給，未滿6個月者減半發給。",
                    reference: "性別工作平等法第十五條"
                }
            },
            preManternity: {
                name: "產檢假",
                granted: "5日",
                detailInfo: "妊娠期間產檢者，得以半日為請假為單位。須附合法醫療機構醫師證明書。",
                others: {
                    paidInfo: "工資照給。(不扣全勤)",
                    reference: "性別工作平等法第十五條"
                }
            },
            accompanyingManternity: {
                name: "陪產假",
                granted: "5日",
                detailInfo: [
                    "員工於其配偶分娩時，給予陪產假5日；受僱者應於配偶分娩之當日及其前後合計15日期間內，擇其中之5日請假。",
                    "上開解釋，舉例而言，某甲配偶於12月8日分娩，若於實際分娩當日（含）之後始首次請假，則得請假之期間應自分娩當日往後推算至第15日(即至12月22日)擇其中5日請陪產假。其於分娩當日往前推算7日之日(即12月1日)請首日陪產假者，其餘陪產假至遲應於12月15日前請畢。"
                ],
                others: {
                    paidInfo: "工資照給。(不扣全勤)",
                    reference: "性別工作平等法第十五條"
                }
            },
            funeral: {
                name: "喪假",
                granted: [
                    "8日",
                    "6日",
                    "3日",
                    "",
                    "",
                    ""
                ],
                detailInfo: [
                    "父母、養父母、繼父母、配偶喪亡者",
                    "祖父母（含外祖父母）、子女、配偶之父母、配偶之養父母或繼父母喪亡者",
                    "曾祖父母、兄弟姊妹、配偶之祖父母（含外祖父母）喪亡者",
                    "1、喪假得依習俗分次申請。",
                    "2、應於死亡之日起百日內請畢為限。",
                    "3、須檢附訃聞或死亡證明書及關係文件。"
                ],
                others: {
                    paidInfo: "工資照給。(不扣全勤)",
                    reference: "勞工請假規則第3條"
                }
            },
            occpationalSick: {
                name: "公傷病假",
                granted: "依實際需要給予",
                detailInfo: "因職業災害而致殘廢、傷害或疾病者，其治療、休養期間，給予公傷病假。",
                others: {
                    paidInfo: "按工資數額補償。但同一事故依勞工保險條例或其他法令規定，已由公司支付費用補償者，公司得予抵充之。",
                    reference: "勞工請假規則第6條"
                }
            },
            official: {
                name: "公假",
                granted: "依實際需要給予",
                detailInfo: "員工奉派出差、考察、訓練、兵役召集及其他法令規定應給公假等，依實際需要天數給予公假。", others: {
                    paidInfo: "工資照給。(不扣全勤)",
                    reference: "勞工請假規則第8條"
                }
            },
            parentalUnpaid: {
                name: "育嬰留職停薪假",
                granted: "二年為限",
                detailInfo: [
                    "受僱者任職滿一年後，於每一子女滿三歲前，得申請育嬰留職停薪。 ",
                    "※檢附證明文件，可申請6個月60% 投保薪資。受僱者之配偶未就業者，不適用規定。"
                ], others: {
                    paidInfo: "不給工資。公司免繳勞健退費用，員工可遞延3年",
                    reference: "性別工作平等法第十六條"
                }
            },
            jobSeeking: {
                name: "謀職假(非自願離職)",
                granted: "依法定預告期間給假",
                detailInfo: [
                    "1、任職三個月以上一年未滿者，於十日前預告之。",
                    "2、任職一年以上三年未滿者，於二十日前預告之。",
                    "3、任職三年以上者，於三十日前預告之。"
                ], others: {
                    paidInfo: "於接到預告後，於未逾法定預告日起算之給假總日數內，為另謀工作得於工作時間請假外出，請假時數，每星期不得超過2日，請假期間工資照給。",
                    reference: "勞動基準法第16條"
                }
            },
            businessTrip: {
                name: "出差假",
                granted: "", detailInfo: "", others: { paidInfo: "", reference: "" }
            },
            annualPreRequest: {
                name: "預請特別休假",
                granted: "同特別休假", detailInfo: "預請下一年度的特別休假", others: { paidInfo: "同特別休假", reference: "同特別休假" }
            },
        }
    }
}