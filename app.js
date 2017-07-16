/*
(15 July 2017) This is the beginning of an application to visualize CWIN's Kobo data.

JS Framework is Angular
CSS Framework is Bootstrap
*/
var myApp = angular.module('myApp', ['cfp.hotkeys','chart.js']);

myApp.directive('inputSquare', function(){
  return {
    restrict: "A",
    replace: true,
    template: '<div style="width:150px; height:150px; background-color:black"></div>'
  };
});

// The main controller of the application
myApp.controller('MainCtrl',['$scope','hotkeys','$interval','$http',function($scope, hotkeys, $interval, $http){
  console.log('start');
  s = $scope; //  just for debugging (simontiu)

  // This function draws the helpline service chart
  var helplineServiceChart = function() {
    $scope.labels1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec"];
    $scope.options1 = { 
        legend: {display: true }, 
        scales: {
            yAxes: [{
                stacked: true
            }],
            xAxes: [{
                stacked: true
            }]
        } };
      $scope.series1 = ["Emergency Rescue", "Emergency Shelter", "Ambulance / Vehicle Service", "Medical Service", "Emergency Support", "Counseling", "Legal Service ", "Family Reintegration", "Referral", "Sponsorship (Education Support)", "Sponsorship (Training)", "Inititation to search missing children", "Family Tracing", "Follow Up", "Field Visit", "Other"];
      $scope.data1 = [
        getMonthCount("1__emergency_r"),
        getMonthCount("2__emergency_s"),
        getMonthCount("3__ambulance__"),
        getMonthCount("4_medical_ser"),
        getMonthCount("5_emergency_s"),
        getMonthCount("6_counseling"),
        getMonthCount("7_legal_servi"),
        getMonthCount("8_family_rein"),
        getMonthCount("9_referral"),
        getMonthCount("10_sponsorshi"),
        getMonthCount("11_sponsorshi"),
        getMonthCount("12_inititatio"),
        getMonthCount("13_family_tra"),
        getMonthCount("14_follow_up"),
        getMonthCount("15_field_visit"),
        getMonthCount("16_others")
      ];
      $scope.datasetOverride1 = [{borderWidth: 0.5}];
    };
  
    // This function draws the 3 major helplines  
  var majorHelplineServiceChart = function() {
    $scope.labels2 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec"];
    $scope.options2 = {legend: {display: true }};
      $scope.series2 = ["Referral","Counseling","Legal Service",];
      $scope.data2 = [
        getMonthCount("9_referral"),
        getMonthCount("6_counseling"),
        getMonthCount("7_legal_servi")
      ];
  };

  $scope.passDetails = function(data){
    $scope.selectedPerson = data;
  }

  // This function runs at the end of the file as an initiation step
  $scope.init = function() {
    console.log('Init');
    // get data
    console.log('http start');
    $http.get('data.json').then(
        function successCallback(response){
            $scope.model = response.data;
            drawAllCharts(); // upon success draw everything
        }, 
        function errorCallback(response) {
            alert('Error: something went wrong :(');
           //error code    
    });
  };

  // Wrapper function for all the charts
  var drawAllCharts = function() {
    helplineServiceChart();
    majorHelplineServiceChart();
    drawCounselingAgeRangeGraph();
    drawCounselingTotalDoughnutGraph();
  }

  // Draws Counseling bar graph by Age Range
  var drawCounselingAgeRangeGraph = function() {
    $scope.cModel = filterDataByHelpline("6_counseling");
    var ageRangeCountBoy = getAgeRangeCount("6_counseling",$scope.cModel,"group_zu9nn95/_8_gender","1__boy");
    var ageRangeCountGirl = getAgeRangeCount("6_counseling",$scope.cModel,"group_zu9nn95/_8_gender","2__girl");
    $scope.ageLabels = ["0-5 Years", "6-10 Years ", "11-13 Years", "14-17 Years ", "17 Years above", "Unidentified"];
    $scope.ageOptions = {legend: {display: true }};
    $scope.ageSeries = ["Boys","Girls"];
    $scope.ageData = [ageRangeCountBoy,ageRangeCountGirl];
  }

  var drawCounselingTotalDoughnutGraph = function() {
    $scope.counselingOptions = {legend: {display: true }};
    $scope.counselingLabels = ["Motivational Counseling", "Family Counseling", "Legal Counseling", "Telephone Counseling", "Individual psycho-social counseling", "Group Counseling"];
    $scope.counselingData = getCounselingCount();

  }

  // This function will take the model and return all entries with the specified helpline service
  var filterDataByHelpline = function(helpline_service) {
    return _.filter($scope.model,function(data) {
        return _.contains(data["group_ai24b73/_35_Helpline_Services_Provided"].split(" "),helpline_service);
    })
  };

    // Pass in the parameter you want to match
  var getAgeRangeCount = function(helpline_service, model, filterField, filterWord) {
    var count = _.countBy(model, function(data) {
        if(_.contains(data["group_ai24b73/_35_Helpline_Services_Provided"].split(" "),helpline_service)){
            if(data[filterField]==filterWord){
                var dateString = data["group_zu9nn95/_7_1_Age_Group"];
                switch (dateString){
                    case "1__0_5_years" : return "0-5 Years"
                    case "2__6_10_years" : return "6-10 Years "
                    case "3__11_13_years" : return "11-13 Years"
                    case "4_14_17_years" : return "14-17 Years "
                    case "5__17_years_ab" : return "17 Years above"
                    case "6__unidentifie" : return "Unidentified"
                    default : return 'false'
                }
            }
        }
        else return 'not in scope';
    })

    //return an array of counts
    return [
        count["0-5 Years"] ? count["0-5 Years"] : 0,
        count["6-10 Years "] ? count["6-10 Years "] : 0,
        count["11-13 Years"] ? count["11-13 Years"] : 0,
        count["14-17 Years "] ? count["14-17 Years "] : 0,
        count["17 Years above"] ? count["17 Years above"] : 0,
        count["Unidentified"] ? count["Unidentified"] : 0
        ];
  };

  // Pass in the parameter you want to match
  var getCounselingCount = function() {
    var count = _.countBy($scope.model, function(data) {
        if(data["group_ai24b73/_37_Type_of_Counseling"]){
            switch (data["group_ai24b73/_37_Type_of_Counseling"]){
                case "1__motivationa" : return "Motivational Counseling"
                case "2__family_coun" : return "Family Counseling"
                case "3__legal_couns" : return "Legal Counseling"
                case "4__telephone_c" : return "Telephone Counseling"
                case "1__individual_" : return "Individual psycho-social counseling"
                case "2__motivationa" : return "Motivational Counseling"
                case "3_group_couns" : return "Group Counseling"
                case "4_legal_couns" : return "Legal Counseling"
                case "5_telephone_c" : return "Telephone Counseling"
            }
        }
        else if(data["group_ai24b73/_37b_Type_of_Counseling_to_Family"]){
            switch (data["group_ai24b73/_37b_Type_of_Counseling_to_Family"]){
                case "1__motivationa" : return "Motivational Counseling"
                case "2__family_coun" : return "Family Counseling"
                case "3__legal_couns" : return "Legal Counseling"
                case "4__telephone_c" : return "Telephone Counseling"
                case "1__individual_" : return "Individual psycho-social counseling"
                case "2__motivationa" : return "Motivational Counseling"
                case "3_group_couns" : return "Group Counseling"
                case "4_legal_couns" : return "Legal Counseling"
                case "5_telephone_c" : return "Telephone Counseling"
            }
        }
        else return 'not in scope';
    })

    //return an array of counts
    return [
        count["Motivational Counseling"] ? count["Motivational Counseling"] : 0,
        count["Family Counseling"] ? count["Family Counseling"] : 0,
        count["Legal Counseling"] ? count["Legal Counseling"] : 0,
        count["Telephone Counseling"] ? count["Telephone Counseling"] : 0,
        count["Individual psycho-social counseling"] ? count["Individual psycho-social counseling"] : 0,
        count["Group Counseling"] ? count["Group Counseling"] : 0
        ];
  };

  // Pass in the parameter you want to match
  var getMonthCount = function(helpline_service) {
    var count = _.countBy($scope.model, function(data) {
        if(_.contains(data["group_ai24b73/_35_Helpline_Services_Provided"].split(" "),helpline_service)){
            var dateString = data["group_zu9nn95/case_registered_date"].split("-");
            switch (dateString[1]){
                case "01": return 'Jan'
                case "02": return 'Feb'
                case "03": return 'Mar'
                case "04": return 'Apr'
                case "05": return 'May'
                case "06": return 'Jun'
                case "07": return 'Jul'
                case "08": return 'Aug'
                case "09": return 'Sep'
                case "10": return 'Oct'
                case "11": return 'Nov'
                case "12": return 'Dec'
                default: return 'false'
            }
        }
        else return 'not in scope';
    })

    //return an array of counts
    return [
        count.Jan ? count.Jan : 0,
        count.Feb ? count.Feb : 0,
        count.Mar ? count.Mar : 0,
        count.Apr ? count.Apr : 0,
        count.May ? count.May : 0,
        count.Jun ? count.Jun : 0,
        count.Jul ? count.Jul : 0,
        count.Aug ? count.Aug : 0,
        count.Sep ? count.Sep : 0,
        count.Oct ? count.Oct : 0,
        count.Nov ? count.Nov : 0,
        count.Dec ? count.Dec : 0
        ];
  };
  
  $scope.mapping = {
    "1__emergency_r" : "Emergency Rescue",
    "2__emergency_s" : "Emergency Shelter",
    "3__ambulance__" : "Ambulance / Vehicle Service",
    "4_medical_ser" : "Medical Service",
    "5_emergency_s" : "Emergency Support",
    "6_counseling" : "Counseling",
    "7_legal_servi" : "Legal Service ",
    "8_family_rein" : "Family Reintegration",
    "9_referral" : "Referral",
    "10_sponsorshi" : "Sponsorship (Education Support)",
    "11_sponsorshi" : "Sponsorship (Training)",
    "12_inititatio" : "Inititation to search missing children",
    "13_family_tra" : "Family Tracing",
    "14_follow_up" : "Follow Up",
    "15_field_visit" : "Field Visit",
    "16_others" : "Others",
    "1__medical_fir" : "Medical First Aid",
    "2__treatment_i" : "Treatment in Hospita",
    "3__treatment_i" : "Treatment in Health Post",
    "1__monitoring" : "Monitoring",
    "2__fact_findin" : "Fact Finding",
    "1_police" : "Case file in Police (FIR)",
    "2_DAO/DCWB" : "Case file in DAO/DCW" ,
    "3_Labor_office" : "Case file in Labor Offic",
    "4_Court" : "Case file in Cour",
    "5_WCO" : "Case file in WC",
    "6_CCWB" : "Case file in CCW",
    "7_commission" : "Case file in Commissio",
    "1__case_on_going" : "Case On-goin",
    "2__case_closed" : "Case Close",
    "3__case_hostile" : "Case Hostil",
    "1__meditation" : "Meditatio",
    "2__negotiation" : "Negotiatio",
    "3__legal_decis" : "Legal Decisio",
    "4__commission" : "Commissio",
    "5__ongoing___nothing_specific_" : "Ongoing / Nothing specific deciso",
    "1_labor_office" : "Labor Offic",
    "2__district_co" : "Distict Cour",
    "3__suprime_cou" : "Suprime Cour",
    "4__cdo" : "CD",
    "5__land_revenu" : "Land Revenue Offic",
    "6__high_court" : "High Cour",
    "7__district_fo" : "District Forest Offic",
    "1__human_right" : "Human Right Commissio",
    "2__women_commi" : "Women Commissio",
    "3__dalit_commi" : "Dalit Commissio",
    "1__agencies_or" : "Agencies/Organisatio",
    "2__court" : "Court",
    "3__meditiation" : "Meditiation Center",
    "4__police_stat" : "Police Statio",
    "5__cdo" : "CD",
    "6__wco" : "WC",
    "1__compensatio" : "Compensatio",
    "2__fine" : "Fin",
    "3__jail_punish" : "Jail Punishmen",
    "4__support" : "Support",
    "5__others" : "Nothing Specifi",
    "1__yes" : "Ye",
    "2__no" : "N",
    "1__child" : "Chil",
    "2__family" : "Famil",
    "1__individual_" : "Individual psycho-social counselin",
    "2__motivationa" : "Motivational counselin",
    "3_group_couns" : "Group Counselin",
    "4_legal_couns" : "Legal Counselin",
    "5_telephone_c" : "Telephone Counselin",
    "6_other" : "Othe",
    "1__motivationa" : "Motivational Counseling",
    "2__family_coun" : "Family Counselin",
    "3__legal_couns" : "Legal Counselin",
    "4__telephone_c" : "Telephone Counselin",
    "5__other" : "Othe",
    "1__not_healed" : "Not Heale",
    "2__partially_h" : "Partially Heale",
    "3__fully_heale" : "Fully Heale",
    "1__not_healed" : "Not Heale",
    "2__partially_h" : "Partially Heale",
    "3__fully_heale" : "Fully Heale",
    "1__cwin_balika" : "CWIN Balika Peace Hom",
    "2__cwin_esp_de" : "CWIN ESP Departmen",
    "3__cwin_self_r" : "CWIN Self Reliance Cente",
    "4__rehabilitat" : "Rehabilitation Cente",
    "5__long_term_s" : "Long Term Shelter Hom",
    "6__legal_organ" : "Legal Organization",
    "7__chn___kathm" : "CHN - Kathmand",
    "8__chn___banke" : "CHN - Bank",
    "9__chn___makwa" : "CHN - Makwanpu",
    "10__chn___kask" : "CHN - Kask",
    "11__chn___mora" : "CHN - Moran",
    "12__chn___kail" : "CHN - Kailal",
    "13__chn___uday" : "CHN - Udayapu",
    "14__chn___chit" : "CHN - Chitwa",
    "15__chn___nawa" : "CHN - Nawalparas",
    "16__chn___surk" : "CHN - Surkhe",
    "17__chn___lamj" : "CHN - Lamjun",
    "18__police" : "Polic",
    "19__ccwb" : "CCW",
    "20__dcwb" : "DCW",
    "21__vdc" : "VD",
    "22__vcpc" : "VCP",
    "23__hospital" : "Hospita",
    "24__mcpc" : "MCP",
    "25__nhrc" : "NHR",
    "26__wco" : "WC",
    "27__dao" : "DA",
    "28__others" : "NCCR (Khojtalash",
    "1__further_cou" : "Further Counseling",
    "2__legal_servi" : "Legal Service",
    "3__long_term_s" : "Long Term Shelter",
    "4__transit_she" : "Transit Shelter",
    "5__family_rein" : "Family Reintegratio",
    "6__sponsorship" : "Sponsorship (Education Support",
    "7__sponsorship" : "Sponsorship (Training",
    "8__other_suppo" : "Other Suppor",
    "1__reintegrate" : "Reintegrated with famil",
    "2__still_at_ce" : "Still at Cente",
    "3__referred" : "Referre",
    "4__left_helpli" : "Left Helpline taking permission",
    "5__left_helpli" : "Left Helpline without taking permissio",
    "1__police___wo" : "Police / Women Cel",
    "2__dcwb" : "DCW",
    "3__wco" : "WC",
    "4__labor_offic" : "Labor Offic",
    "5__nhrc" : "NHR",
    "6__vdc" : "VD",
    "7__vcpc" : "VCP",
    "8__mcpc" : "MCP",
    "9__ddc" : "DD",
    "10__school" : "Schoo",
    "11__hospital" : "Hospita",
    "12__ccwb" : "CCW",
    "13__wcpc" : "WCP",
    "14__mowscw" : "MoWSC",
    "15__national_w" : "National Women Commissio",
    "16_dao" : "DA",
    "1__boy" : "Boy",
    "2__girl" : "Girl",
    "3__third_gende" : "Third Gender",
    "1__abuse" : "Abuse",
    "2__corporal_pu" : "Corporal Punishment",
    "3__labor_explo" : "Labor Exploitation",
    "4__lost_and_fo" : "Lost or Found",
    "5__sick" : "Sick",
    "6__sponsor__ed" : "Sponsor (Education Support)",
    "7__sponsor__tr" : "Sponsor (Training)",
    "8__neglect" : "Neglect",
    "9__orphaned" : "Orphaned",
    "10__traffickin" : "Trafficking",
    "11__accident" : "Accident",
    "12__child_deli" : "Child Delinquency",
    "13__psycho_soc" : "Psycho-social Problem",
    "14__family_con" : "Family Conflict",
    "15__parents_in" : "Parents in Jail",
    "16__bullying" : "Bullying",
    "17__kidnapping" : "Kidnapping",
    "18__financial_" : "Financial Crisis",
    "19__drug_used" : "Drug Used",
    "20__careless_t" : "Careless to Children",
    "21__death" : "Death",
    "22__child_marr" : "Child Marriage",
    "23__hiv___aids" : "HIV / AIDS",
    "24__physical_d" : "Physical Disablle",
    "25__mentally_i" : "Mentally ill",
    "26__mentally_c" : "Mentally Challenged",
    "27__glue_sniff" : "Glue Sniffing",
    "28__displaced" : "Displaced",
    "29__birth_regi" : "Birth Registration",
    "30__citizenshi" : "Citizenship Certificate",
    "31__request_fo" : "Request for Shelter",
    "32_Torture" : "Torture",
    "33.Others" : "Others"
  };
  $scope.searchText = "";
  // $scope.model = mapping;
  $scope.init();
}]);