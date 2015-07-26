
var myApp = movieApp;

myApp.labels_en = {
    "Movies": "Movies",
    "Filter" : "Filter",
    "Features" : "Features",
    "Region" : "Region",
    "Type" : "Type",
    "Language" : "Language",
    "Search" : "Search",
    "hollywood" : "Hollywood",
    "bollywood" : "Bollywood",
    "tollywood" : "Tollywood",
    "subtitles" : "Subtitles",
    "high definition" : "High Definition",
    "standard definition" : "Standard Definition",
    "animation" : "Animation",
    "hindi" : "Hindi",
    "engllish" : "English",
    "other" : "Other",
    "year" : "Year",
    "Options" : "Options",
    "Display item per page" : "Display item per page",
    "Sort by" : "Sort by",
    "Close" : "Close"
};

myApp.labels_hi = {
    "Movies": "फिल्में",
    "Filter": "फिल्टर",
    "Features" : "विशेषताएं",
    "Region" : "क्षेत्र",
    "Type" : "प्रकार",
    "Language" : "भाषा",
    "Search" : "खोजें",
    "hollywood" : "हॉलीवुड",
    "bollywood" : "बॉलीवुड",
    "tollywood" : "टॉलीवुड",
    "subtitles" : "उपशीर्षक",
    "high definition" : "हाई परिभाषा",
    "standard definition" : "मानक परिभाषा",
    "animation" : "एनीमेशन",
    "hindi" : "हिन्दी",
    "english" : "अंग्रेज़ी",
    "other" : "अन्य",
    "year" : "वर्ष",
    "Options" : "विकल्प",
    "Display item per page" : "प्रति पृष्ठ प्रदर्शित आइटम",
    "Sort by" : "इसके अनुसार क्रमबद्ध करें",
    "Close" : "बंद करे"
};

myApp.config(["$translateProvider", function($translateProvider) {
        $translateProvider.translations("en", myApp.labels_en);
        $translateProvider.translations("hi", myApp.labels_hi);
        $translateProvider.preferredLanguage("en");
    }
]);