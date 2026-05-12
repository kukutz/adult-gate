# Kids Mode Adult Gate

Клиентская JS-библиотека для подтверждения перед отключением детского режима. Она показывает короткую задачу с таймером, проверяет ответ в браузере и вызывает `onPass`, если пользователь справился.

Важно: клиентский барьер нельзя считать надежной age-verification системой. Его можно обойти через DevTools или модификацию клиента. Для юридически значимой проверки возраста нужна серверная логика и подходящий провайдер верификации.

## Демо

[Открыть тестовую страницу](https://raw.githack.com/kukutz/adult-gate/main/test-page.html)

## Подключение

```html
<script type="module">
  import { createAdultGate } from "./src/adult-gate.js";

  const gate = createAdultGate({
    timeLimitMs: 15000,
    maxAttempts: 3,
    onPass() {
      disableKidsMode();
    }
  });

  document.querySelector("#disable-kids-mode").addEventListener("click", async () => {
    const result = await gate.open();
    if (result.ok) {
      console.log("Kids mode disabled");
    }
  });

  function disableKidsMode() {
    localStorage.setItem("kidsMode", "off");
  }
</script>
```

## API

```js
import { AdultGate, createAdultGate, ADULT_GATE_CHALLENGES } from "./src/adult-gate.js";
```

- `createAdultGate(options)` создает экземпляр.
- `gate.open(overrides)` показывает модальное окно и возвращает `Promise`.
- `gate.close()` закрывает активное окно.
- `ADULT_GATE_CHALLENGES` содержит 100 задач: бюрократия, финансы, жилье, бытовая рутина, транспорт, работа, здоровье, путешествия, ретро-форматы, аналоговые часы и короткая числовая проверка.

Опции:

- `timeLimitMs`: лимит времени, по умолчанию `15000`.
- `maxAttempts`: количество неудачных попыток, по умолчанию `3`.
- `root`: DOM-узел, куда рендерить модалку.
- `onPass(challenge, result)`: вызывается при успехе.
- `onFail(challenge, result)`: вызывается при ошибке, отмене или тайм-ауте.
- `onLockout()`: вызывается после превышения лимита попыток.
- `random`: функция случайности, удобна для тестов.

## Настройка набора задач

```js
const gate = createAdultGate({
  challenges: ADULT_GATE_CHALLENGES.filter((item) => item.category !== "retro")
});
```

Для более сильного барьера используйте несколько задач подряд и храните итоговое состояние на сервере, а не только в `localStorage`.
