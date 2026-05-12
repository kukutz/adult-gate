const DEFAULT_OPTIONS = {
  timeLimitMs: 15000,
  minPassingScore: 1,
  maxAttempts: 3,
  title: "Подтвердите, что вы взрослый",
  description: "Чтобы отключить детский режим, решите короткую задачу.",
  confirmLabel: "Проверить",
  cancelLabel: "Отмена",
  retryLabel: "Другая задача",
  lockoutMessage: "Слишком много попыток. Попробуйте позже.",
  root: null,
  random: Math.random
};

const NORMALIZATION_MAP = new Map([
  ["ё", "е"],
  ["й", "и"]
]);

export const ADULT_GATE_CHALLENGES = [
  choice("tax-vat-ru", "Какая аббревиатура обозначает налог на добавленную стоимость?", ["НДФЛ", "НДС", "ОСАГО", "СНИЛС"], "НДС", "bureaucracy"),
  choice("tax-ndfl-ru", "Какой налог обычно удерживают из зарплаты работника в России?", ["НДС", "НДФЛ", "ОСАГО", "ПСН"], "НДФЛ", "bureaucracy"),
  choice("inn-purpose", "Что обычно обозначает ИНН?", ["Номер налогоплательщика", "Номер банковской карты", "Индекс посылки", "Номер школы"], "Номер налогоплательщика", "bureaucracy"),
  choice("snils-purpose", "Какой документ часто нужен для пенсионного и социального учета?", ["СНИЛС", "VIN", "IMEI", "ISBN"], "СНИЛС", "bureaucracy"),
  choice("oms-purpose", "Какой полис обычно предъявляют для бесплатной медицинской помощи в России?", ["ОМС", "ОСАГО", "КАСКО", "ПТС"], "ОМС", "bureaucracy"),
  choice("insurance-osago", "Какая аббревиатура относится к обязательному автострахованию?", ["ОМС", "ОСАГО", "ИНН", "ЕГЭ"], "ОСАГО", "bureaucracy"),
  choice("passport-age-ru", "В каком возрасте в России обычно получают первый паспорт?", ["10 лет", "14 лет", "18 лет", "21 год"], "14 лет", "bureaucracy"),
  choice("passport-replace-ru", "В каком возрасте в России обычно впервые меняют паспорт после 14 лет?", ["16 лет", "18 лет", "20 лет", "25 лет"], "20 лет", "bureaucracy"),
  choice("receipt-total", "Где на кассовом чеке обычно указана итоговая сумма к оплате?", ["Итого", "Артикул", "Смена", "Кассир"], "Итого", "bureaucracy"),
  choice("utility-bill", "Какой документ обычно оплачивают каждый месяц за квартиру?", ["Квитанция ЖКХ", "Посадочный талон", "Киноафиша", "Гарантийный талон"], "Квитанция ЖКХ", "bureaucracy"),
  choice("meter-readings", "Что обычно передают управляющей компании по счетчикам воды или электричества?", ["Показания", "Пароль Wi-Fi", "Размер обуви", "Номер школы"], "Показания", "bureaucracy"),
  choice("management-company", "Куда обычно обращаются по поводу протечки в подъезде или начислений ЖКХ?", ["В управляющую компанию", "В кинотеатр", "В авиакомпанию", "В книжный магазин"], "В управляющую компанию", "bureaucracy"),
  choice("property-tax", "Какой налог может прийти владельцу квартиры или дома?", ["Налог на имущество", "Налог на игру", "Налог на погоду", "Налог на переписку"], "Налог на имущество", "bureaucracy"),
  choice("act-completion", "Какой документ часто подписывают после оказания услуги или ремонта?", ["Акт выполненных работ", "Билет в кино", "Школьный дневник", "Меню"], "Акт выполненных работ", "bureaucracy"),
  choice("power-of-attorney", "Как называется документ, позволяющий одному человеку действовать от имени другого?", ["Доверенность", "Абонемент", "Купон", "Маршрутка"], "Доверенность", "bureaucracy"),
  choice("personal-data-consent", "Что обычно подписывают перед обработкой персональных данных?", ["Согласие", "Рецепт", "Плейлист", "Расписание"], "Согласие", "bureaucracy"),
  choice("registered-mail-notice", "Что обычно получают в почтовом ящике, если заказное письмо ждёт на почте?", ["Извещение", "Чек АЗС", "Меню", "Билет"], "Извещение", "bureaucracy"),
  choice("employment-contract", "Какой документ обычно подписывают при официальном трудоустройстве?", ["Трудовой договор", "Читательский билет", "Подарочный сертификат", "Багажную бирку"], "Трудовой договор", "bureaucracy"),
  choice("cvv-digits", "Сколько цифр обычно в CVV/CVC коде на обратной стороне банковской карты?", ["2", "3", "4", "6"], "3", "finance"),
  choice("bank-card-expiry", "В каком формате чаще всего указан срок действия банковской карты?", ["ММ/ГГ", "ДД.ММ.ГГГГ", "ГГГГ-ММ-ДД", "ЧЧ:ММ"], "ММ/ГГ", "finance"),
  choice("pin-safety", "Что нельзя сообщать человеку из банка по телефону?", ["PIN-код карты", "Название банка", "Город проживания", "Валюту счета"], "PIN-код карты", "finance"),
  choice("credit-interest-rate", "Что означает годовая ставка по кредиту?", ["Процент за год", "Сумму наличных в банкомате", "Номер договора", "День недели"], "Процент за год", "finance"),
  choice("mortgage", "Что обычно покупают в ипотеку?", ["Жилье", "Проездной", "Книгу", "Билет в кино"], "Жилье", "finance"),
  choice("debit-card", "Что обычно происходит при оплате дебетовой картой?", ["Списываются собственные деньги", "Автоматически берется ипотека", "Начисляется штраф ГИБДД", "Открывается вклад"], "Списываются собственные деньги", "finance"),
  choice("credit-card-grace-period", "Что обычно означает льготный период по кредитной карте?", ["Срок без процентов при выполнении условий", "Период начисления минимального платежа", "Срок блокировки карты после выпуска", "Период ожидания выписки по счету"], "Срок без процентов при выполнении условий", "finance"),
  choice("autopayment", "Что такое автоплатеж?", ["Автоматическое списание по расписанию", "Платеж только наличными", "Запрет платежей", "Печать чека"], "Автоматическое списание по расписанию", "finance"),
  choice("cashback", "Что обычно называют кэшбэком?", ["Возврат части суммы покупки", "Штраф за просрочку", "Плату за парковку", "Срок действия паспорта"], "Возврат части суммы покупки", "finance"),
  choice("overdraft", "Что означает овердрафт по карте?", ["Возможность уйти в минус", "Запрет на покупки", "Бонус за регистрацию", "Номер карты"], "Возможность уйти в минус", "finance"),
  choice("deposit-interest", "Что обычно начисляют на банковский вклад?", ["Проценты", "Комиссию за эквайринг", "Страховую франшизу", "Кредитный лимит"], "Проценты", "finance"),
  choice("bank-bik", "Что из этого больше похоже на банковский реквизит организации?", ["БИК", "FPS", "HP", "NPC"], "БИК", "finance"),
  choice("payment-purpose", "Какое поле в банковском переводе объясняет, за что отправлены деньги?", ["Назначение платежа", "БИК банка получателя", "Корреспондентский счет", "Код валютной операции"], "Назначение платежа", "finance"),
  choice("sbp-transfer", "Через что в России часто переводят деньги по номеру телефона между банками?", ["СБП", "ЖКХ", "ПТС", "ЕГЭ"], "СБП", "finance"),
  choice("late-payment-penalty", "Что могут начислить за просрочку платежа по кредиту?", ["Пени или штраф", "Кэшбэк", "Бонусные мили", "Скидку"], "Пени или штраф", "finance"),
  choice("insurance-deductible", "Что означает франшиза в страховании?", ["Часть ущерба, которую клиент платит сам", "Название банка", "Срок паспорта", "Тип батарейки"], "Часть ущерба, которую клиент платит сам", "finance"),
  choice("chargeback", "Как обычно называется оспаривание карточной операции через банк?", ["Чарджбэк", "Овертайм", "Капремонт", "Флюорография"], "Чарджбэк", "finance"),
  choice("currency-spread", "Как обычно называется разница между курсом покупки и продажи валюты?", ["Спред", "Маржа эквайринга", "Кросс-курс", "Валютная переоценка"], "Спред", "finance"),
  choice("rent-deposit", "Что обычно означает залог при аренде квартиры?", ["Возвратная сумма на случай ущерба", "Скидка на первый месяц", "Оплата интернета", "Налог продавца"], "Возвратная сумма на случай ущерба", "housing"),
  choice("rent-meter-payments", "Если в договоре аренды написано «счетчики оплачиваются отдельно», за что обычно платит арендатор сверх аренды?", ["Воду, электричество или газ по показаниям", "Комиссию риелтора каждый месяц", "Взнос на капитальный ремонт собственника", "Налог на имущество владельца"], "Воду, электричество или газ по показаниям", "housing"),
  choice("rent-inventory", "Что обычно фиксируют в акте приема-передачи квартиры?", ["Состояние мебели, техники и показания счетчиков", "Размер ежемесячного НДФЛ арендодателя", "Кадастровую стоимость всего дома", "График капитального ремонта подъезда"], "Состояние мебели, техники и показания счетчиков", "housing"),
  choice("rent-notice", "Что обычно означает условие «предупредить о выезде за 30 дней»?", ["Заранее сообщить арендодателю о расторжении", "Оплатить последний месяц двойным платежом", "Передать залог управляющей компании", "Оформить временную регистрацию"], "Заранее сообщить арендодателю о расторжении", "housing"),
  choice("security-deposit-return", "Когда обычно возвращают обеспечительный платеж по аренде?", ["После выезда, сверки долгов и состояния квартиры", "До подписания договора аренды", "Сразу после первого просмотра квартиры", "В день каждой оплаты коммунальных услуг"], "После выезда, сверки долгов и состояния квартиры", "housing"),
  choice("common-area", "Что обычно относят к общедомовому имуществу в многоквартирном доме?", ["Подъезд и лифт", "Личный ноутбук", "Частную банковскую карту", "Домашнюю зубную щетку"], "Подъезд и лифт", "housing"),
  choice("rent-indexation", "Что обычно означает индексация арендной платы в договоре?", ["Плановое повышение аренды по условию договора", "Возврат залога частями каждый месяц", "Оплату коммунальных услуг по среднему", "Запрет расторгать договор досрочно"], "Плановое повышение аренды по условию договора", "housing"),
  choice("capital-repair", "Что обычно означает строка «капремонт» в квартирной квитанции?", ["Взнос на капитальный ремонт дома", "Покупку мебели", "Оплату мобильной связи", "Детский абонемент"], "Взнос на капитальный ремонт дома", "housing"),
  choice("fridge-temp", "Какая температура обычно поддерживается в основной камере холодильника?", ["-18°C", "+4°C", "+15°C", "0°C"], "+4°C", "household"),
  choice("freezer-temp", "Какая температура типична для морозильной камеры?", ["+4°C", "-18°C", "+12°C", "+25°C"], "-18°C", "household"),
  choice("laundry-symbol", "Что обычно означает тазик с числом 30 на ярлыке одежды?", ["Стирка при 30°C", "Гладить 30 секунд", "Сушить 30 минут", "Размер 30"], "Стирка при 30°C", "household"),
  choice("circuit-breaker", "Что чаще всего проверяют в щитке, если внезапно пропал свет в квартире?", ["Автоматический выключатель", "Почтовый индекс", "Сливной фильтр", "IMEI телефона"], "Автоматический выключатель", "household"),
  choice("gas-smell", "Что в первую очередь делают при запахе газа в квартире?", ["Перекрывают газ и проветривают", "Включают свет", "Зажигают спичку", "Закрывают вентиляцию"], "Перекрывают газ и проветривают", "household"),
  choice("kettle-scale", "Что обычно удаляют лимонной кислотой из чайника?", ["Накипь", "Ржавчину с батареи", "Пыль с экрана", "Клей с этикетки"], "Накипь", "household"),
  choice("washing-machine-filter", "Что иногда чистят внизу стиральной машины, если она плохо сливает воду?", ["Сливной фильтр", "SIM-лоток", "Клавиатуру", "Фары"], "Сливной фильтр", "household"),
  choice("sink-siphon", "Как называется изогнутая часть под раковиной, где часто собирается засор?", ["Сифон", "Роутер", "Домкрат", "Картридж"], "Сифон", "household"),
  choice("smoke-detector", "Что обычно меняют в автономном датчике дыма, когда он периодически пищит?", ["Батарейку", "Паспорт", "Шину", "Счетчик воды"], "Батарейку", "household"),
  choice("dishwasher-salt", "Что добавляют в посудомоечную машину для работы ионообменника и смягчения воды?", ["Специальную соль", "Ополаскиватель для блеска", "Таблетку с моющим средством", "Средство для очистки фильтра"], "Специальную соль", "household"),
  choice("radiator-air", "Что выпускают из радиатора через кран Маевского?", ["Воздух", "Бензин", "Песок", "Чернила"], "Воздух", "household"),
  choice("drill-bit", "Что меняют в дрели, чтобы сделать отверстие другого диаметра?", ["Сверло", "Розетку", "Плинтус", "Фильтр"], "Сверло", "household"),
  choice("electric-meter-night", "Что означает двухтарифный счетчик электроэнергии?", ["Разные тарифы днем и ночью", "Две квартиры в одной", "Два паспорта", "Два холодильника"], "Разные тарифы днем и ночью", "household"),
  choice("water-shutoff", "Что обычно перекрывают перед заменой смесителя?", ["Воду", "Wi-Fi", "Домофон", "Телевизор"], "Воду", "household"),
  choice("mold-ventilation", "Что чаще всего помогает уменьшить плесень из-за высокой влажности?", ["Проветривание и вентиляция", "Больше закрытых окон", "Соль на полке", "Громкая музыка"], "Проветривание и вентиляция", "household"),
  choice("tire-pressure", "В чем обычно измеряют давление в автомобильных шинах в быту?", ["Атмосферы или бары", "Киловатты", "Литры", "Градусы"], "Атмосферы или бары", "transport"),
  choice("manual-middle-pedal", "Какая педаль находится посередине в автомобиле с механической коробкой передач?", ["Газ", "Тормоз", "Сцепление", "Ручник"], "Тормоз", "transport"),
  choice("manual-left-pedal", "Какая педаль находится слева в автомобиле с механической коробкой передач?", ["Газ", "Тормоз", "Сцепление", "Ручник"], "Сцепление", "transport"),
  choice("engine-coolant-temp", "Что обычно означает красный индикатор температуры охлаждающей жидкости на панели автомобиля?", ["Двигатель перегревается", "Низкий уровень топлива", "Включен дальний свет", "Открыта крышка багажника"], "Двигатель перегревается", "transport"),
  choice("parking-receipt", "Что обычно стоит сохранить после оплаты платной парковки?", ["Подтверждение оплаты с номером парковочной сессии", "Свидетельство о регистрации автомобиля", "Полис ОСАГО в бумажном виде", "Талон техосмотра"], "Подтверждение оплаты с номером парковочной сессии", "transport"),
  choice("europrotocol", "Как называется оформление мелкого ДТП без вызова полиции при соблюдении условий?", ["Европротокол", "Загранпаспорт", "Автоплатеж", "Домофон"], "Европротокол", "transport"),
  choice("pts-car", "Какой документ относится к паспорту транспортного средства?", ["ПТС", "ОМС", "СНИЛС", "ИНН"], "ПТС", "transport"),
  choice("sts-car", "Какой документ водитель обычно возит как свидетельство регистрации машины?", ["СТС", "ЕГЭ", "QR", "ISBN"], "СТС", "transport"),
  choice("winter-tires", "Что обычно ставят на автомобиль перед зимним сезоном?", ["Зимние шины", "Летние шины с меньшим давлением", "Запасное колесо вместо всех колес", "Новый комплект дворников вместо шин"], "Зимние шины", "transport"),
  choice("fuel-octane", "Что обозначают числа 92, 95 или 98 на бензине?", ["Октановое число", "Номер колонки", "Температуру", "Срок годности"], "Октановое число", "transport"),
  choice("hotel-preauth", "Что отель может временно заблокировать на карте при заселении?", ["Депозит", "Паспорт", "Багаж", "SIM-карту"], "Депозит", "travel"),
  choice("boarding-gate", "Что означает gate на посадочном талоне?", ["Выход на посадку", "Номер паспорта", "Вес багажа", "Название банка"], "Выход на посадку", "travel"),
  choice("hotel-checkin-deposit", "Зачем отель часто просит карту или депозит при заселении?", ["Для покрытия мини-бара, ущерба или неоплаченных услуг", "Для оплаты визового сбора в консульстве", "Для покупки обратного авиабилета", "Для оформления туристической страховки"], "Для покрытия мини-бара, ущерба или неоплаченных услуг", "travel"),
  choice("visa-consulate", "Куда обычно подают документы на визу?", ["В консульство или визовый центр", "В ЖЭК", "В шиномонтаж", "В кинотеатр"], "В консульство или визовый центр", "travel"),
  choice("international-passport", "Какой документ обычно нужен гражданину России для поездки за границу?", ["Загранпаспорт", "ПТС", "Кассовый чек", "Абонемент"], "Загранпаспорт", "travel"),
  choice("salary-net", "Что обычно называют зарплатой «на руки»?", ["Сумму после удержаний", "Сумму до налогов", "Номер счета", "Премию за год"], "Сумму после удержаний", "work"),
  choice("salary-gross", "Что обычно означает зарплата gross?", ["Сумма до вычета налогов", "Сумма в кошельке", "Оплата парковки", "Стоимость аренды"], "Сумма до вычета налогов", "work"),
  choice("probation-period", "Что означает испытательный срок в трудовом договоре?", ["Период проверки на работе", "Срок действия паспорта", "Время доставки еды", "Период ремонта лифта"], "Период проверки на работе", "work"),
  choice("paid-leave", "Как обычно называется ежегодный оплачиваемый перерыв в работе?", ["Отпуск", "Овердрафт", "Франшиза", "Счетчик"], "Отпуск", "work"),
  choice("payslip", "Какой документ показывает начисления и удержания по зарплате?", ["Расчетный листок", "Багажная бирка", "Меню", "Талон к врачу"], "Расчетный листок", "work"),
  choice("business-day-after-friday", "Если платеж обещают провести в следующий рабочий день после пятницы, когда это обычно будет?", ["Суббота", "Воскресенье", "Понедельник", "Среда"], "Понедельник", "work"),
  choice("first-quarter-end", "Какой месяц закрывает первый квартал года?", ["Февраль", "Март", "Апрель", "Июнь"], "Март", "work"),
  choice("expense-report", "Как обычно называется отчет сотрудника за выданные под отчет деньги?", ["Авансовый отчет", "Классный журнал", "Билет", "Квитанция багажа"], "Авансовый отчет", "work"),
  choice("invoice-due", "Что означает срок оплаты в счете?", ["Дата, до которой нужно заплатить", "Дата доставки товара", "Дата рождения продавца", "Срок гарантии телефона"], "Дата, до которой нужно заплатить", "work"),
  choice("nda-meaning", "Что обычно означает NDA в рабочих документах?", ["Соглашение о неразглашении", "Налог на добавленную стоимость", "Номер дома", "Тип батарейки"], "Соглашение о неразглашении", "work"),
  choice("prescription", "Какой документ врач выписывает для покупки рецептурного лекарства?", ["Рецепт", "Чек", "Багажную бирку", "Промокод"], "Рецепт", "health"),
  choice("medical-referral", "Как называется документ от врача к специалисту или на обследование?", ["Направление", "Заключение", "Выписка", "Рецепт"], "Направление", "health"),
  choice("blood-test-fasting", "Что обычно означает указание «сдать анализ натощак»?", ["Не есть перед анализом установленное время", "Не пить воду за сутки до анализа", "Принять антибиотик перед анализом", "Сдать анализ только после ужина"], "Не есть перед анализом установленное время", "health"),
  choice("deductible-medical-insurance", "Что обычно означает франшиза в добровольной медицинской страховке?", ["Часть расходов оплачивает сам застрахованный", "Полис действует только за границей", "Страховая покрывает только лекарства", "Врач принимает только по направлению"], "Часть расходов оплачивает сам застрахованный", "health"),
  choice("sick-leave-employer", "Кому обычно сообщают номер электронного больничного?", ["Работодателю", "Кассиру кинотеатра", "Таксисту", "Почтальону"], "Работодателю", "health"),
  choice("cassette-pencil", "Для чего чаще всего использовали карандаш с аудиокассетой?", ["Перемотать пленку", "Почистить экран", "Увеличить громкость", "Сделать копию"], "Перемотать пленку", "retro"),
  choice("vhs-rewind", "Что обычно делали с видеокассетой перед возвратом в прокат?", ["Перематывали на начало", "Стирали маркером", "Заряжали", "Форматировали"], "Перематывали на начало", "retro"),
  choice("dial-phone", "Что нужно было сделать на дисковом телефоне после каждой цифры?", ["Дождаться возврата диска", "Нажать Enter", "Провести картой", "Включить Bluetooth"], "Дождаться возврата диска", "retro"),
  choice("floppy-size", "Какой носитель часто называли дискетой?", ["Гибкий магнитный диск", "Кабель зарядки", "Банковскую карту", "SIM-карту"], "Гибкий магнитный диск", "retro"),
  choice("film-camera", "Что обычно нужно было сделать с фотопленкой после съемки?", ["Проявить", "Зарядить", "Синхронизировать", "Обновить"], "Проявить", "retro"),
  choice("analog-calendar-billing", "Счет выставлен 31 января с оплатой в течение 10 календарных дней. Какой последний день оплаты в обычном году?", ["10 февраля", "9 февраля", "11 февраля", "1 марта"], "10 февраля", "adult-routine"),
  choice("analog-quarter", "Если минутная стрелка на 3, сколько минут прошло после часа?", ["3", "10", "15", "30"], "15", "analog"),
  choice("inclusive-payment-deadline", "Если в счете написано «оплатить до 10 февраля включительно», какой день обычно последний для оплаты?", ["10 февраля", "9 февраля", "11 февраля", "Первый рабочий день после 10 февраля"], "10 февраля", "adult-routine"),
  text("numeracy-sqrt-144", "Введите цифрами квадратный корень из 144.", ["12"], "numeracy"),
  choice("numeracy-sqrt-121", "Какой квадратный корень из 121?", ["9", "10", "11", "12"], "11", "numeracy"),
  choice("numeracy-percent-2500", "10% от 2 500 рублей — это сколько?", ["25", "250", "500", "2 250"], "250", "numeracy")
];

export class AdultGate {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.challenges = options.challenges || ADULT_GATE_CHALLENGES;
    this.attempts = 0;
    this.active = null;
  }

  open(overrides = {}) {
    const options = { ...this.options, ...overrides };
    if (!options.root && typeof document === "undefined") {
      throw new Error("AdultGate.open() requires a browser document or an explicit root.");
    }

    if (this.attempts >= options.maxAttempts) {
      options.onLockout?.();
      return Promise.resolve({ ok: false, reason: "lockout" });
    }

    const challenge = options.challenge || this.pickChallenge(options.random);
    return new Promise((resolve) => {
      this.active?.destroy();
      this.active = renderGate({
        options,
        challenge,
        onDone: (result) => {
          this.active = null;
          if (!result.ok && result.reason !== "cancel") {
            this.attempts += 1;
          }
          if (result.ok) {
            this.attempts = 0;
            options.onPass?.(challenge, result);
          } else {
            options.onFail?.(challenge, result);
          }
          resolve({ ...result, challenge });
        }
      });
    });
  }

  close() {
    this.active?.destroy();
    this.active = null;
  }

  pickChallenge(random = Math.random) {
    const index = Math.floor(random() * this.challenges.length);
    return this.challenges[Math.max(0, Math.min(index, this.challenges.length - 1))];
  }
}

export function createAdultGate(options) {
  return new AdultGate(options);
}

export function validateChallenge(challenge, value) {
  if (challenge.type === "hold" || challenge.type === "sequence") {
    return value === true;
  }

  if (challenge.type === "choice") {
    return normalize(value) === normalize(challenge.answer);
  }

  if (challenge.type === "text") {
    return challenge.answers.some((answer) => normalize(value) === normalize(answer));
  }

  return false;
}

function renderGate({ options, challenge, onDone }) {
  const doc = options.root?.ownerDocument || document;
  const root = options.root || doc.body;
  const previousActive = doc.activeElement;
  const overlay = el(doc, "div", "adult-gate__overlay");
  const dialog = el(doc, "section", "adult-gate__dialog");
  const title = el(doc, "h2", "adult-gate__title", options.title);
  const description = el(doc, "p", "adult-gate__description", options.description);
  const prompt = el(doc, "p", "adult-gate__prompt", challenge.prompt);
  const timer = el(doc, "div", "adult-gate__timer");
  const body = el(doc, "div", "adult-gate__body");
  const error = el(doc, "div", "adult-gate__error");
  const actions = el(doc, "div", "adult-gate__actions");
  const cancel = button(doc, "adult-gate__button adult-gate__button--secondary", options.cancelLabel);
  const confirm = button(doc, "adult-gate__button adult-gate__button--primary", challenge.confirmLabel || options.confirmLabel);

  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "adult-gate-title");
  title.id = "adult-gate-title";
  error.setAttribute("role", "alert");

  const state = renderChallengeBody(doc, body, challenge, confirm, options.random);
  actions.append(cancel, confirm);
  dialog.append(title, description, prompt, timer, body, error, actions);
  overlay.append(dialog);
  injectStyles(doc);
  root.append(overlay);

  let done = false;
  const startedAt = Date.now();
  const duration = Number(challenge.timeLimitMs ?? options.timeLimitMs);
  const hasTimer = duration > 0;
  const interval = hasTimer ? setInterval(updateTimer, 100) : null;
  updateTimer();

  cancel.addEventListener("click", () => finish({ ok: false, reason: "cancel" }));
  confirm.addEventListener("click", () => {
    const result = state.read();
    if (validateChallenge(challenge, result)) {
      finish({ ok: true, reason: "passed" });
      return;
    }
    error.textContent = "Неверно. Детский режим остался включен.";
    finish({ ok: false, reason: "failed" });
  });
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") finish({ ok: false, reason: "cancel" });
    if (event.key === "Enter" && challenge.type !== "hold") confirm.click();
  });

  setTimeout(() => state.focus?.(), 0);

  function updateTimer() {
    if (!hasTimer) {
      timer.textContent = "Время не ограничено";
      return;
    }
    const remaining = Math.max(0, duration - (Date.now() - startedAt));
    timer.textContent = `Осталось: ${Math.ceil(remaining / 1000)} сек.`;
    if (remaining <= 0) {
      finish({ ok: false, reason: "timeout" });
    }
  }

  function finish(result) {
    if (done) return;
    done = true;
    clearInterval(interval);
    destroy();
    onDone(result);
  }

  function destroy() {
    if (interval) clearInterval(interval);
    overlay.remove();
    if (previousActive && typeof previousActive.focus === "function") {
      previousActive.focus();
    }
  }

  return { destroy };
}

function renderChallengeBody(doc, body, challenge, confirm, random = Math.random) {
  if (challenge.type === "choice") {
    const name = `adult-gate-${challenge.id}`;
    const inputs = shuffleOptions(challenge.options, random).map((option) => {
      const label = el(doc, "label", "adult-gate__option");
      const input = doc.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = option;
      label.append(input, doc.createTextNode(option));
      body.append(label);
      return input;
    });
    return {
      read: () => inputs.find((input) => input.checked)?.value || "",
      focus: () => inputs[0]?.focus()
    };
  }

  if (challenge.type === "text") {
    const input = doc.createElement("input");
    input.className = "adult-gate__input";
    input.type = "text";
    input.autocomplete = "off";
    input.inputMode = "text";
    body.append(input);
    return {
      read: () => input.value,
      focus: () => input.focus()
    };
  }

  if (challenge.type === "hold") {
    let holdTimer = null;
    let passed = false;
    confirm.disabled = true;
    const holdButton = button(doc, "adult-gate__hold", "Удерживать");
    const progress = el(doc, "div", "adult-gate__hold-progress");
    holdButton.append(progress);
    body.append(holdButton);

    const clearHold = () => {
      clearTimeout(holdTimer);
      progress.style.width = "0%";
    };
    holdButton.addEventListener("pointerdown", () => {
      progress.style.transitionDuration = `${challenge.durationMs}ms`;
      progress.style.width = "100%";
      holdTimer = setTimeout(() => {
        passed = true;
        confirm.disabled = false;
        confirm.focus();
      }, challenge.durationMs);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
      holdButton.addEventListener(eventName, () => {
        if (!passed) clearHold();
      });
    });
    return {
      read: () => passed,
      focus: () => holdButton.focus()
    };
  }

  if (challenge.type === "sequence") {
    const pressed = [];
    const buttons = [
      ["left", "←"],
      ["right", "→"],
      ["up", "↑"],
      ["down", "↓"]
    ].map(([value, label]) => {
      const item = button(doc, "adult-gate__icon-button", label);
      item.setAttribute("aria-label", value);
      item.addEventListener("click", () => {
        pressed.push(value);
        item.classList.add("adult-gate__icon-button--pressed");
        setTimeout(() => item.classList.remove("adult-gate__icon-button--pressed"), 140);
      });
      body.append(item);
      return item;
    });
    return {
      read: () => arraysEqual(pressed.slice(-challenge.sequence.length), challenge.sequence),
      focus: () => buttons[0]?.focus()
    };
  }

  return { read: () => "" };
}

function injectStyles(doc) {
  if (doc.getElementById("adult-gate-styles")) return;
  const style = doc.createElement("style");
  style.id = "adult-gate-styles";
  style.textContent = `
    .adult-gate__overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(20, 24, 31, 0.64);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #172033;
    }
    .adult-gate__dialog {
      width: min(460px, 100%);
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 22px 80px rgba(0, 0, 0, 0.28);
      padding: 24px;
    }
    .adult-gate__title {
      margin: 0 0 8px;
      font-size: 22px;
      line-height: 1.2;
      letter-spacing: 0;
    }
    .adult-gate__description,
    .adult-gate__prompt {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 1.45;
    }
    .adult-gate__prompt {
      font-weight: 650;
    }
    .adult-gate__timer {
      margin-bottom: 14px;
      font-size: 13px;
      color: #526070;
    }
    .adult-gate__body {
      display: grid;
      gap: 10px;
      margin-bottom: 14px;
    }
    .adult-gate__option {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      padding: 9px 11px;
      border: 1px solid #d6dce5;
      border-radius: 6px;
      cursor: pointer;
    }
    .adult-gate__input {
      width: 100%;
      box-sizing: border-box;
      min-height: 44px;
      border: 1px solid #b8c1cc;
      border-radius: 6px;
      padding: 10px 12px;
      font: inherit;
    }
    .adult-gate__actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 18px;
    }
    .adult-gate__button,
    .adult-gate__hold,
    .adult-gate__icon-button {
      border: 0;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
    }
    .adult-gate__button {
      min-height: 40px;
      padding: 0 14px;
    }
    .adult-gate__button--primary {
      background: #172033;
      color: #fff;
    }
    .adult-gate__button--primary:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .adult-gate__button--secondary {
      background: #edf1f5;
      color: #172033;
    }
    .adult-gate__error {
      min-height: 18px;
      color: #a32222;
      font-size: 13px;
    }
    .adult-gate__hold {
      position: relative;
      overflow: hidden;
      min-height: 48px;
      background: #edf1f5;
      color: #172033;
    }
    .adult-gate__hold-progress {
      position: absolute;
      inset: 0 auto 0 0;
      width: 0%;
      background: rgba(23, 32, 51, 0.18);
      transition-property: width;
      transition-timing-function: linear;
    }
    .adult-gate__icon-button {
      min-width: 52px;
      min-height: 44px;
      margin-right: 8px;
      background: #edf1f5;
      color: #172033;
      font-size: 22px;
    }
    .adult-gate__icon-button--pressed {
      background: #cdd7e3;
    }
  `;
  doc.head.append(style);
}

function choice(id, prompt, options, answer, category) {
  return { id, type: "choice", category, prompt, options, answer };
}

function text(id, prompt, answers, category) {
  return { id, type: "text", category, prompt, answers };
}

function hold(id, prompt, durationMs, category) {
  return { id, type: "hold", category, prompt, durationMs, confirmLabel: "Готово" };
}

function sequence(id, prompt, sequenceValue, category) {
  return { id, type: "sequence", category, prompt, sequence: sequenceValue };
}

function button(doc, className, text) {
  const item = doc.createElement("button");
  item.type = "button";
  item.className = className;
  item.textContent = text;
  return item;
}

function el(doc, tag, className, text) {
  const item = doc.createElement(tag);
  item.className = className;
  if (text) item.textContent = text;
  return item;
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[ёй]/g, (char) => NORMALIZATION_MAP.get(char) || char)
    .replace(/\s+/g, " ");
}

function shuffleOptions(options, random) {
  const result = [...options];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}
