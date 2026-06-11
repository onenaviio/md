# Эндпоинт площадки: получение бронирований (`/bookings`) — тарифные площадки

← [Индекс задач](tasks.md) · [Контракт тарифа](tasks/00-contract-rate.md) · [Эндпоинт `/rates`](endpoint-rates.md) · [Архитектура](architecture.md)

> **Реализуется на стороне Площадки.** Вариант эндпоинта `/bookings` для **тарифных площадок**
> (`Extranet::Client#rates_enabled = true`). Отличие от базового — в брони передаётся
> опциональное поле `rate_id` (тариф, по которому оформлена бронь).

RealtyCalendar будет отправлять запросы на этот эндпоинт на получение бронирований
каждые 3 минуты.

## Запрос (Request)

URL: `POST /bookings`

| Параметр | Положение | Тип | Описание |
|----------|-----------|-----|----------|
| `auth_token` | query (url) | string | Идентификатор пользователя |
| `sign` | query (url) | string | Подпись сообщения ([подробнее](#подпись-сообщения)) |
| `accommodation_ids` | body (json) | array[string] | Массив из ID объектов, для которых нужно получить информацию о бронированиях (содержит хотя бы один элемент) |
| `modified_from` | body (json) | datetime | Дата модификации (может отсутствовать). Если этот параметр присутствует, то выгружаются только брони, созданные или модифицированные после переданной даты. Формат даты `YYYY-MM-DDThh:mm:ss` |
| `timezone` | body (json) | string | Часовой пояс, формат `Z ±HHmm`. По умолчанию MSK `+03:00` |

## Пример запроса

`private_key = "ZvCq2iiqpEs4TJrjLBt"`

Пример для cURL

```bash
curl 'http://<your_host>/bookings?auth_token=CQqK8A4WGSsIWXeivG459pe&sign=03c32f0e9951838a501707acc16487d1' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  --data-raw '{ "modified_from": "2015-10-09T17:55:42", "accommodation_ids": ["1123","55678", "65324"] }'
```

## Ответ (Response)

В ответе должны быть все новые/изменённые брони за переданный промежуток времени.

Если нет записей, соответствующих запросу, то в ответ нужно прислать пустой массив броней:

```json
{
  "bookings": []
}
```

Поля, помеченные `*`, обязательны.

| Поле | Тип | Описание |
|------|-----|----------|
| `booking_id` * | string | Номер бронирования |
| `accommodation_id` * | string | Идентификатор объекта размещения со стороны площадки |
| `date_from` * | string | Дата заезда (`YYYY-MM-DD`) |
| `date_to` * | string | Дата выезда (`YYYY-MM-DD`) |
| `price` * | integer | Общая цена бронирования |
| `booking_date` * | datetime (iso8601) | Дата и время бронирования в часовом поясе, переданном в запросе как `timezone` |
| `last_update` * | datetime (iso8601) | Дата и время последнего изменения в часовом поясе, переданном в запросе как `timezone`. Важно, чтобы при каждой модификации бронирования (например, при его отмене) в поле `last_update` передавались дата и время этой модификации |
| `contact_name` * | string | Имя контактного лица |
| `contact_phone` * | string | Телефон контактного лица |
| `contact_email` * | string | Email контактного лица |
| `guests` | integer | Количество гостей |
| `payment_amount` | decimal (`#.##`) | Оплаченная гостем сумма |
| `payment_datetime` | datetime (iso8601) | Дата и время оплаты брони гостем в часовом поясе, переданном в запросе как `timezone` |
| `commission` | decimal (`#.##`) | Комиссия площадки в абсолютном значении (не %) |
| `notes` | string | Примечания по бронированию |
| `canceled` | boolean | Если присутствует и имеет значение `true`, значит гость отменил бронирование |
| `rate_id` | string | **Тарифные площадки.** ID тарифа, по которому оформлена бронь (из списка тарифов объекта, см. [`/rates`](endpoint-rates.md)). Передаётся опционально; используется информационно |

Примечания:

- Поля `contact_name`, `contact_phone` и `contact_email` являются контактными. Необходимо, чтобы хотя бы одно из них было заполнено.
- Дата в поле `date_to` должна быть больше, чем в `date_from`. Они не могут быть равны.
- `last_update` является ключевым для обновления бронирования. Если оно совпадает со значением из прошлой версии бронирования (сохранённой ранее), то обновления не произойдёт.
- `rate_id` — только для тарифных площадок; для остальных площадок поле не передаётся.

Пример ответа

```json
{
  "bookings": [
    {
      "booking_id": "11235",
      "accommodation_id": "3345",
      "date_from": "2015-10-09",
      "date_to": "2015-10-16",
      "guests": 2,
      "price": 14000,
      "payment_amount": 14000.00,
      "payment_datetime": "2015-08-09T18:33:42",
      "commission": 1400,
      "contact_name": "Ivanov Ivan",
      "contact_phone": "+79261231212",
      "contact_email": "ivanov@example.com",
      "notes": "Будем в 18-00. Нужны красные тапочки",
      "last_update": "2015-08-09T18:33:42",
      "canceled": false,
      "booking_date": "2015-08-09T18:33:42",
      "rate_id": "RATE-001"
    },
    {
      "booking_id": "334123",
      "accommodation_id": "3335",
      "date_from": "2015-11-19",
      "date_to": "2015-11-21",
      "guests": 2,
      "price": 5000,
      "payment_amount": 2500.00,
      "payment_datetime": "2015-08-09T18:33:42",
      "commission": 500,
      "contact_name": "Petr Petrov",
      "contact_phone": "+79269876543",
      "contact_email": "petr@example.com",
      "notes": "",
      "last_update": "2015-08-09T18:33:42",
      "canceled": true,
      "booking_date": "2015-08-08T12:33:42",
      "rate_id": "RATE-002"
    }
  ]
}
```