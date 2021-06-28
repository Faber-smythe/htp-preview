import locale77427fae from '../..\\locales\\en.ts'
import locale775268ab from '../..\\locales\\fr.ts'
import locale773050d6 from '../..\\locales\\de.ts'

export const Constants = {
  COMPONENT_OPTIONS_KEY: "nuxtI18n",
  STRATEGIES: {"PREFIX":"prefix","PREFIX_EXCEPT_DEFAULT":"prefix_except_default","PREFIX_AND_DEFAULT":"prefix_and_default","NO_PREFIX":"no_prefix"},
}
export const nuxtOptions = {
  isUniversalMode: false,
  trailingSlash: undefined,
}
export const options = {
  vueI18n: {"locale":"en","fallbackLocale":"en","content":{"i18nContent":{"fr":{"Language_fr":"Français","Language_en":"Anglais","Language_de":"Allemand","home":"Accueil","Tutorial_Exit_Clue":"Fermer le tutoriel","Tutorial_History_Clue":"Ouvrez ce panneau déroulant pour en apprendre plus sur ce lieu.","Tutorial_Slider_Clue":"Voyagez dans le temps en faisant défiler la frise chronologique.","Tutorial_Scroll_Clue":"Continuez à faire défiler la page pour découvrir la suite.","Tutorial_Immersive_Clue":"Tutorial_Immersive_Clue","Tutorial_Treasure_Clue":"Ouvrez ce panneau pour consulter le trésor que vous avez trouvé.","Treasure_Congrats":"Félicitations&nbsp;!\nVous avez trouvé un trésor&nbsp;!","france.chinon.forteresse":"Forteresse Royale<br/>de Chinon","imm_cuisine_title_today":"Cuisines du roi, aujourd'hui","imm_cuisine_title_15th":"Cuisines du roi, 15e siècle","imm_cuisine_label_15thcentury":"XVe siècle","imm_cuisine_label_today":"Aujourd'hui","imm_cuisine_treasure_name":"Mortier en marbre de carrare","imm_cuisine_treasure_description":["Ce mortier est une pièce très chère qu'il est rare de trouver dans des cuisines. Ce marbre importé d'italie est particulièrement lourd et solide."],"iim_cuisine_history":["This is a fascinating story about this immersive.","Here is another cool paragraph on the matter. Let's just make it extra long to see if we can get a line break somewhere.","Now we'll drop a lorem ipsum to test the scroll capacity of the container :","Aenean rhoncus, tortor nec suscipit aliquet, neque quam tempus sapien, sit amet tristique nibh ipsum ut ligula. Cras at odio ac felis pulvinar suscipit. Maecenas finibus lacinia libero, ac eleifend arcu vulputate ac. Nam elit tellus, congue vel nibh quis, ornare varius tellus. Nam nisi quam, ornare vitae tincidunt ut, sagittis et sapien. Ut non pellentesque dui.","Maecenas sit amet bibendum ligula. Sed eros purus, ultricies at tincidunt non, elementum in lectus. Donec neque nisi, tincidunt vehicula magna a, accumsan ullamcorper dolor. Nunc hendrerit ante sollicitudin enim dictum posuere. Pellentesque a libero mauris. Nullam sit amet mauris eu libero ultricies consequat. Cras rhoncus, neque nec porttitor rhoncus, augue elit faucibus sapien, vitae laoreet purus velit ut elit. Aenean non dapibus risus, et tristique lectus.","Maecenas auctor dolor nec nisi rhoncus, bibendum viverra metus maximus. Duis dictum placerat libero, non posuere lacus lacinia id. Pellentesque sit amet velit leo. Suspendisse vestibulum lectus justo, quis ultrices mi ultricies a. Maecenas sit amet luctus nibh. Pellentesque velit massa, pulvinar id sollicitudin eget, cursus vitae purus. Donec volutpat cursus est. Vestibulum nunc massa, faucibus a mi vitae, ullamcorper viverra velit.","Nulla a purus feugiat tortor dignissim porta. Integer lorem arcu, malesuada eu lectus consequat, sollicitudin ultricies magna. Pellentesque cursus tempus mauris, a rutrum justo laoreet nec. Nullam maximus posuere placerat. Fusce eget purus quis leo dapibus blandit tristique ac velit. Praesent facilisis velit quis felis fermentum, eget congue justo bibendum. Praesent lacinia, nibh nec molestie dictum, massa mauris consequat quam, vel congue mi magna eu nibh. Quisque et quam maximus, vulputate metus vitae, consectetur libero. Cras ut nulla accumsan, ultrices dolor quis, porta metus. In hac habitasse platea dictumst. Nunc faucibus tortor sit amet metus gravida, a commodo massa aliquam.","Vestibulum finibus, enim vitae laoreet venenatis, turpis orci sodales diam, eu dignissim nunc tellus sit amet ipsum. Mauris sit amet arcu ac lorem accumsan placerat. Nulla in felis a nunc blandit euismod vel ut enim. Quisque vulputate nisl et tempor sagittis. Quisque ac fermentum augue, eu rutrum metus. Integer at diam at dolor lobortis pretium. Phasellus ullamcorper congue justo, vitae ultrices lectus ullamcorper et. Suspendisse at nisl non ante lobortis eleifend ut at velit. Sed non est leo. Nullam sit amet urna vitae risus sodales consequat. Cras vulputate quis urna nec ultricies. Cras commodo placerat leo nec ultricies. Nunc placerat mattis nibh, a sollicitudin sem rhoncus sed. Duis eget ultricies nibh, nec bibendum purus. Etiam scelerisque libero neque, et ullamcorper libero vulputate at. Aenean felis ligula, scelerisque sed scelerisque et, mollis id magna."],"iim_cuisine_hotspot_gardemanger":"Pas de pain pour les souris ! Un garde-manger suspendu protège cette denrée des rongeurs : broyé en fines miettes, le pain dur est utilisé pour épaissir sauces et potages.","iim_cuisine_hotspot_marsouin":"Le marsouin, mammifère très présent dans les mers du Moyen Âge, est un mets prestigieux : celui-ci a été offert en cadeau à la reine Marie d’Anjou.","iim_cuisine_hotspot_panierpoissons":"Les jours \"maigres\" (le vendredi et certaines fêtes ou veilles de fêtes religieuses, ainsi que les 40 jours du Carême), la tradition chrétienne interdit la viande en signe de pénitence : elle est alors remplacée par du poisson.","iim_cuisine_hotspot_tonneaupoissons":"Pour conserver du poisson pendant plus d’un an, il faut bien le préparer : les harengs pêchés en haute mer sont vidés sur le bateau et aussitôt tassés dans des tonneaux avec du sel.","iim_cuisine_hotspot_gibier":"Le gibier chassé le jour même sera cuisiné dans les jours suivants, afin que les chairs de l’animal se détendent.","iim_cuisine_hotspot_tonneauxverjus":"Tonneaux de \"verjus\", ou jus de raisin vert. Il sert de base aux sauces légères et acides appréciées dans le royaume de France, alors que le reste de l’Europe préfère des sauces épaisses et sucrées !","iim_cuisine_hotspot_ecrevisses":"Écrevisses cuites, décortiquées, puis broyées et mélangées avec des amandes, des épices et du verjus, pour faire un potage épais appelé \"grave\".","iim_cuisine_hotspot_grill":"Un \"galopin\" (ou garçon de cuisine) est chargé de faire tourner les grils régulièrement, pour une cuisson optimale des poissons."},"en":{"Language_fr":"French","Language_en":"English","Language_de":"German","Home":"Home","Trailerline":"Brace yourselves...","Tutorial_Exit_Clue":"Close the tutorial.","Tutorial_History_Clue":"Open this panel to learn more about this place.","Tutorial_Slider_Clue":"Travel through time using the slider below.","Tutorial_Scroll_Clue":"Keep scrolling to check the rest of the page.","Tutorial_Immersive_Clue":"Tutorial_Immersive_Clue","Tutorial_Treasure_Clue":"Open this panel to see the treasure you found","Treasure_Congrats":"Congratulations&nbsp;!\nYou found a treasure!","france.chinon.forteresse":"Royal fortress<br/>of Chinon","imm_cuisine_title_today":"The Royal Kitchens, today","imm_cuisine_title_15th":"The Royal Kitchens, 15th c.","imm_cuisine_label_15thcentury":"15th c.","imm_cuisine_label_today":"Today","imm_cuisine_treasure_name":"Carrara marble mortar","imm_cuisine_treasure_description":["This mortar is a very expensive part that is rare to find in kitchens. This marble imported from Italy is particularly heavy and solid."],"iim_cuisine_history":["This is a fascinating story about this immersive.","Here is another cool paragraph on the matter. Let's just make it extra long to see if we can get a line break somewhere.","Now we'll drop a lorem ipsum to test the scroll capacity of the container :","Aenean rhoncus, tortor nec suscipit aliquet, neque quam tempus sapien, sit amet tristique nibh ipsum ut ligula. Cras at odio ac felis pulvinar suscipit. Maecenas finibus lacinia libero, ac eleifend arcu vulputate ac. Nam elit tellus, congue vel nibh quis, ornare varius tellus. Nam nisi quam, ornare vitae tincidunt ut, sagittis et sapien. Ut non pellentesque dui.","Maecenas sit amet bibendum ligula. Sed eros purus, ultricies at tincidunt non, elementum in lectus. Donec neque nisi, tincidunt vehicula magna a, accumsan ullamcorper dolor. Nunc hendrerit ante sollicitudin enim dictum posuere. Pellentesque a libero mauris. Nullam sit amet mauris eu libero ultricies consequat. Cras rhoncus, neque nec porttitor rhoncus, augue elit faucibus sapien, vitae laoreet purus velit ut elit. Aenean non dapibus risus, et tristique lectus.","Maecenas auctor dolor nec nisi rhoncus, bibendum viverra metus maximus. Duis dictum placerat libero, non posuere lacus lacinia id. Pellentesque sit amet velit leo. Suspendisse vestibulum lectus justo, quis ultrices mi ultricies a. Maecenas sit amet luctus nibh. Pellentesque velit massa, pulvinar id sollicitudin eget, cursus vitae purus. Donec volutpat cursus est. Vestibulum nunc massa, faucibus a mi vitae, ullamcorper viverra velit.","Nulla a purus feugiat tortor dignissim porta. Integer lorem arcu, malesuada eu lectus consequat, sollicitudin ultricies magna. Pellentesque cursus tempus mauris, a rutrum justo laoreet nec. Nullam maximus posuere placerat. Fusce eget purus quis leo dapibus blandit tristique ac velit. Praesent facilisis velit quis felis fermentum, eget congue justo bibendum. Praesent lacinia, nibh nec molestie dictum, massa mauris consequat quam, vel congue mi magna eu nibh. Quisque et quam maximus, vulputate metus vitae, consectetur libero. Cras ut nulla accumsan, ultrices dolor quis, porta metus. In hac habitasse platea dictumst. Nunc faucibus tortor sit amet metus gravida, a commodo massa aliquam.","Vestibulum finibus, enim vitae laoreet venenatis, turpis orci sodales diam, eu dignissim nunc tellus sit amet ipsum. Mauris sit amet arcu ac lorem accumsan placerat. Nulla in felis a nunc blandit euismod vel ut enim. Quisque vulputate nisl et tempor sagittis. Quisque ac fermentum augue, eu rutrum metus. Integer at diam at dolor lobortis pretium. Phasellus ullamcorper congue justo, vitae ultrices lectus ullamcorper et. Suspendisse at nisl non ante lobortis eleifend ut at velit. Sed non est leo. Nullam sit amet urna vitae risus sodales consequat. Cras vulputate quis urna nec ultricies. Cras commodo placerat leo nec ultricies. Nunc placerat mattis nibh, a sollicitudin sem rhoncus sed. Duis eget ultricies nibh, nec bibendum purus. Etiam scelerisque libero neque, et ullamcorper libero vulputate at. Aenean felis ligula, scelerisque sed scelerisque et, mollis id magna."],"iim_cuisine_hotspot_gardemanger":"No bread for the mice! A hanging pantry protects food from rodents: crushed into fine crumbs, bread gone hard is used to thicken sauces and soups.","iim_cuisine_hotspot_marsouin":"The porpoise, a mammal present in abundance in the seas of the Middle Ages, is a prestigious dish: it was offered as a gift to Queen Marie of Anjou.","iim_cuisine_hotspot_panierpoissons":"On \"lean days\" (Fridays and certain feasts or vigils of religious festivals, including the 40 days of Lent), the Christian tradition as a sign of penance forbids the consumption of meat: it is replaced by fish.","iim_cuisine_hotspot_tonneaupoissons":"To store fish for more than a year, it must be prepared: herring caught on the high seas are emptied on the boat and immediately packed in barrels filled with salt.","iim_cuisine_hotspot_gibier":"Game hunted today will be cooked in days to follow, allowing the flesh of the animal to tenderize.","iim_cuisine_hotspot_tonneauxverjus":"Barrels of \"verjus,\" green grape juice. Verjus serves as a base for mild and acidic sauces appreciated in the kingdom of France, while the rest of Europe prefers thicker, sweeter sauces!","iim_cuisine_hotspot_ecrevisses":"Cooked crayfish is shelled, crushed, and mixed with almonds, spices, and verjus to make a thick soup called \"grave,\" meaning \"serious.\"","iim_cuisine_hotspot_grill":"A \"galopin,\" or kitchen boy, is in charge of turning the spit regularly for an optimal grilling of the fish."},"de":{"Language_fr":"Französisch","Language_en":"Englisch","Language_de":"Deutsch","home":"Home","Tutorial_Exit_Clue":"Das Tutoriel schließen","Tutorial_History_Clue":"Öffnen Sie diesen Rollout, um mehr über diesen Ort zu erfahren.","Tutorial_Slider_Clue":"Gleiten Sie den Zeiger lang, um in die Zeit zu reisen.","Tutorial_Scroll_Clue":"Scrollen Sie weiter, um mehr zu erfahren.","Tutorial_Immersive_Clue":"Tutorial_Immersive_Clue","Tutorial_Treasure_Clue":"Öffnen Sie dieses Fenster, um den gefundenen Schatz anzuzeigen.","Treasure_Congrats":"Gratulierung&nbsp;!\nSie haben ein Schatz gefunden&nbsp;!","france.chinon.forteresse":"Königliche Burg<br/>von Chinon","imm_cuisine_title_15th":"Königliche Küchen, 15. Jh.","imm_cuisine_title_today":"Königliche Küchen, heute","imm_cuisine_label_15thcentury":"15. Jh.","imm_cuisine_label_today":"Heute","imm_cuisine_treasure_name":"Carrara-Marmor Mörser","imm_cuisine_treasure_description":["Dieser Mörser ist ein sehr teures Teil, das in Küchen selten zu finden ist. Dieser aus Italien importierte Marmor ist besonders schwer und fest."],"iim_cuisine_history":["This is a fascinating story about this immersive.","Here is another cool paragraph on the matter. Let's just make it extra long to see if we can get a line break somewhere.","Now we'll drop a lorem ipsum to test the scroll capacity of the container :","Aenean rhoncus, tortor nec suscipit aliquet, neque quam tempus sapien, sit amet tristique nibh ipsum ut ligula. Cras at odio ac felis pulvinar suscipit. Maecenas finibus lacinia libero, ac eleifend arcu vulputate ac. Nam elit tellus, congue vel nibh quis, ornare varius tellus. Nam nisi quam, ornare vitae tincidunt ut, sagittis et sapien. Ut non pellentesque dui.","Maecenas sit amet bibendum ligula. Sed eros purus, ultricies at tincidunt non, elementum in lectus. Donec neque nisi, tincidunt vehicula magna a, accumsan ullamcorper dolor. Nunc hendrerit ante sollicitudin enim dictum posuere. Pellentesque a libero mauris. Nullam sit amet mauris eu libero ultricies consequat. Cras rhoncus, neque nec porttitor rhoncus, augue elit faucibus sapien, vitae laoreet purus velit ut elit. Aenean non dapibus risus, et tristique lectus.","Maecenas auctor dolor nec nisi rhoncus, bibendum viverra metus maximus. Duis dictum placerat libero, non posuere lacus lacinia id. Pellentesque sit amet velit leo. Suspendisse vestibulum lectus justo, quis ultrices mi ultricies a. Maecenas sit amet luctus nibh. Pellentesque velit massa, pulvinar id sollicitudin eget, cursus vitae purus. Donec volutpat cursus est. Vestibulum nunc massa, faucibus a mi vitae, ullamcorper viverra velit.","Nulla a purus feugiat tortor dignissim porta. Integer lorem arcu, malesuada eu lectus consequat, sollicitudin ultricies magna. Pellentesque cursus tempus mauris, a rutrum justo laoreet nec. Nullam maximus posuere placerat. Fusce eget purus quis leo dapibus blandit tristique ac velit. Praesent facilisis velit quis felis fermentum, eget congue justo bibendum. Praesent lacinia, nibh nec molestie dictum, massa mauris consequat quam, vel congue mi magna eu nibh. Quisque et quam maximus, vulputate metus vitae, consectetur libero. Cras ut nulla accumsan, ultrices dolor quis, porta metus. In hac habitasse platea dictumst. Nunc faucibus tortor sit amet metus gravida, a commodo massa aliquam.","Vestibulum finibus, enim vitae laoreet venenatis, turpis orci sodales diam, eu dignissim nunc tellus sit amet ipsum. Mauris sit amet arcu ac lorem accumsan placerat. Nulla in felis a nunc blandit euismod vel ut enim. Quisque vulputate nisl et tempor sagittis. Quisque ac fermentum augue, eu rutrum metus. Integer at diam at dolor lobortis pretium. Phasellus ullamcorper congue justo, vitae ultrices lectus ullamcorper et. Suspendisse at nisl non ante lobortis eleifend ut at velit. Sed non est leo. Nullam sit amet urna vitae risus sodales consequat. Cras vulputate quis urna nec ultricies. Cras commodo placerat leo nec ultricies. Nunc placerat mattis nibh, a sollicitudin sem rhoncus sed. Duis eget ultricies nibh, nec bibendum purus. Etiam scelerisque libero neque, et ullamcorper libero vulputate at. Aenean felis ligula, scelerisque sed scelerisque et, mollis id magna."],"iim_cuisine_hotspot_gardemanger":"Kein Brot für die Mäuse! Ein aufgehängter Speisebehälter schützte dieses Lebensmittel vor den Nagern: Hartes Brot wurde zu feinen Krümeln zerdrückt und zum Andicken von Saucen und Gemüsesuppen genutzt.","iim_cuisine_hotspot_marsouin":"Schweinswal war ein prestigeträchtiges Gericht, auch wenn das Säugetier im Mittelalter in den Meeren häufig vorkam: Dieser hier war ein Geschenk an Königin Marie d'Anjou.","iim_cuisine_hotspot_panierpoissons":"An „mageren“ Tagen (Freitag sowie bestimmte Feiertage oder die Tage vor Festtagen, wie die 40 Fastentage) verbietet die christliche Tradition zum Zeichen der Buße den Fleischverzehr: Und so gibt es stattdessen Fisch.","iim_cuisine_hotspot_tonneaupoissons":"Um Fisch länger als ein Jahr aufheben zu können, muss er auf spezielle Art zubereitet werden: Die auf hoher See gefischten Heringe werden an Bord ausgenommen und sofort in Salzfässern eingelegt.","iim_cuisine_hotspot_gibier":"Das am Tag gejagte Wild wurde erst in den folgenden Tagen zubereitet, damit das Fleisch gut abgehangen war.","iim_cuisine_hotspot_tonneauxverjus":"Fässer mit „Verjus“, Saft aus vergorenen grünen Trauben. Er diente als Basis für leichte, saure Saucen, wie sie im französischen Königreich besonders geschätzt wurden, wohingegen das restliche Europa dicke, süße Saucen bevorzugte!","iim_cuisine_hotspot_ecrevisses":"Gekochte, geschälte Krebse, anschließend zerdrückt und mit Mandeln, Gewürzen und Verjus vermischt, ergaben eine dickflüssige Suppe, die „Grave“ genannt wurde.","iim_cuisine_hotspot_grill":"Ein „Galopin“ oder Küchenjunge war damit beauftragt, regelmäßig die Bratspieße zu drehen und so für die optimale Garstufe der Fische zu sorgen."}}}},
  vueI18nLoader: false,
  locales: [{"code":"en","name":"English","iso":"en-US","file":"en.ts"},{"code":"fr","name":"Français","iso":"fr-FR","file":"fr.ts"},{"code":"de","name":"Deutsch  ","iso":"de-DE","file":"de.ts"}],
  defaultLocale: "en",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  defaultLocaleRouteNameSuffix: "default",
  strategy: "prefix",
  lazy: false,
  langDir: "C:\\Users\\johan\\Documents\\Dev\\histopad-preview\\locales",
  rootRedirect: null,
  detectBrowserLanguage: {"alwaysRedirect":true,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","onlyOnNoPrefix":false,"onlyOnRoot":true,"useCookie":true},
  differentDomains: false,
  seo: true,
  baseUrl: "",
  vuex: {"moduleName":"i18n","syncLocale":false,"syncMessages":false,"syncRouteParams":true},
  parsePages: false,
  pages: {"_site/index":{"en":"/:site","fr":"/:site","de":"/:site"}},
  skipSettingLocaleOnNavigate: false,
  beforeLanguageSwitch: () => null,
  onBeforeLanguageSwitch: () => {},
  onLanguageSwitched: () => null,
  normalizedLocales: [{"code":"en","name":"English","iso":"en-US","file":"en.ts"},{"code":"fr","name":"Français","iso":"fr-FR","file":"fr.ts"},{"code":"de","name":"Deutsch  ","iso":"de-DE","file":"de.ts"}],
  localeCodes: ["en","fr","de"],
}

export const localeMessages = {
  'en.ts': () => Promise.resolve(locale77427fae),
  'fr.ts': () => Promise.resolve(locale775268ab),
  'de.ts': () => Promise.resolve(locale773050d6),
}