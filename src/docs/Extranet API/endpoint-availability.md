# Эндпоинт площадки: информация о занятости (`/availability`) — тарифные площадки

> **Реализуется на стороне Площадки.** Вариант эндпоинта `/availability` для **тарифных
> площадок** (`Extranet::Client#rates_enabled = true`). Отличие от базового — в сообщениях
> `prices_and_restrictions` передаётся измерение `rate_id` (цены и ограничения экспортируются
> **по каждому тарифу**). Блок `availabilities` **не меняется**.

RealtyCalendar будет отправлять цены, параметры занятости и ограничений на площадку каждый раз,
когда они будут изменены.

## Запрос (Request)

URL: `POST /availability`

| Параметр | Положение | Тип | Описание |
|----------|-----------|-----|----------|
| `auth_token` | query (url) | string | Идентификатор пользователя |
| `sign` | query (url) | string | Подпись сообщения ([подробнее](#подпись-сообщения)) |
| `availabilities` | body (json) | array[object] | Массив сообщений с информацией о занятости |
| ∟ `record_id` | | integer | Номер записи в сообщении |
| ∟ `date_from` | | date (`YYYY-MM-DD`) | Дата заезда |
| ∟ `date_to` | | date (`YYYY-MM-DD`) | Дата выезда |
| ∟ `accommodation_id` | | string | Идентификатор объекта размещения |
| ∟ `count` | | integer | Количество свободных номеров для бронирования |
| ∟ `agency_id` | | integer | Идентификатор агентства. Необязательный параметр. Отправляется, если площадке это необходимо |
| `prices_and_restrictions` | body (json) | array[object] | Массив сообщений с информацией о ценах и ограничениях |
| ∟ `record_id` | | integer | Номер записи в сообщении |
| ∟ `date_from` | | date (`YYYY-MM-DD`) | Дата заезда |
| ∟ `date_to` | | date (`YYYY-MM-DD`) | Дата выезда |
| ∟ `accommodation_id` | | string | Идентификатор объекта размещения |
| ∟ `rate_id` | | string | **Тарифные площадки.** ID тарифа, к которому относятся цена и ограничения данного сообщения (из списка тарифов объекта, см. [`/rates`](endpoint-rates.md)) |
| ∟ `price` | | integer | Цена за ночь |
| ∟ `guest_count` | | integer | Кол-во основных мест |
| ∟ `extra_fee` | | integer | Наценка за доп. гостей |
| ∟ `min_stay` | | integer | Минимальный срок бронирования |
| ∟ `max_stay` | | integer | Максимальный срок бронирования |
| ∟ `closed` | | boolean | Тариф закрыт на продажу на данный период (`true` — продажа недоступна) |
| ∟ `closed_to_arrival` | | boolean | Период закрыт для заселения (`true` — заезд в указанные даты недоступен) |
| ∟ `closed_to_departure` | | boolean | Период закрыт для выселения (`true` — выезд в указанные даты недоступен) |
| ∟ `agency_id` | | integer | Идентификатор агентства. Необязательный параметр. Отправляется, если площадке это необходимо |

> **Экспорт по тарифам.** Для тарифной площадки на один и тот же период и объект приходит
> **по одному сообщению `prices_and_restrictions` на каждый тариф** — записи различаются полем
> `rate_id`. Цена и ограничения уже рассчитаны под конкретный тариф (наценка, мин/макс срок).
> Блок `availabilities` тарифного измерения **не содержит** — занятость общая для объекта.

## Пример запроса

`private_key = "ZvCq2iiqpEs4TJrjLBt"`

Пример для cURL

```bash
curl 'http://<your_host>/availability?auth_token=CQqK8A4WGSsIWXeivG459pe&sign=03c32f0e9951838a501707acc16487d1' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "availabilities": [
      { "record_id": 1, "accommodation_id": "A1", "date_from": "2026-06-10", "date_to": "2026-06-15", "count": 1 }
    ],
    "prices_and_restrictions": [
      { "record_id": 1, "accommodation_id": "A1", "rate_id": "RATE-001", "date_from": "2026-06-10", "date_to": "2026-06-15", "price": 1000, "guest_count": 2, "extra_fee": 0, "min_stay": 1, "max_stay": 364, "closed": false, "closed_to_arrival": false, "closed_to_departure": false },
      { "record_id": 2, "accommodation_id": "A1", "rate_id": "RATE-002", "date_from": "2026-06-10", "date_to": "2026-06-15", "price": 1300, "guest_count": 2, "extra_fee": 0, "min_stay": 2, "max_stay": 30, "closed": false, "closed_to_arrival": false, "closed_to_departure": false }
    ]
  }'
```

> Для тарифной площадки на один период/объект приходит по одной записи `prices_and_restrictions`
> на каждый тариф — записи различаются полем `rate_id` (здесь `RATE-001` и `RATE-002`).

## Ответ (Response)

В ответ приходит либо пустой объект, если не было никаких ошибок, либо объект, в котором
перечислены записи с ошибками и описанием ошибки.

| Параметр | Тип | Описание |
|----------|-----|----------|
| `availabilities` | array[object] | |
| ∟ `record_id` | integer | Номер записи в сообщении |
| ∟ `error` | string | Текст ошибки |
| `prices_and_restrictions` | array[object] | |
| ∟ `record_id` | integer | Номер записи в сообщении |
| ∟ `error` | string | Текст ошибки |

## Пример ответа с ошибками

Обратите внимание, что текст ошибок может быть любым, необязательно как указано в примере ниже.
Главное — соблюдать требование к формату JSON.

```json
{
  "availabilities": [
    {
      "record_id": 2,
      "error": "Wrong accommodation_id"
    },
    {
      "record_id": 7,
      "error": "Wrong date period"
    }
  ],
  "prices_and_restrictions": [
    {
      "record_id": 1,
      "error": "Wrong price format"
    }
  ]
}
```

## Как часто вызывается этот метод

- Каждый час для определённого количества интеграций в рамках двухнедельной выгрузки всех данных
  на площадку. В течение 2 недель происходит равномерная выгрузка занятости и цен для всех
  активных интеграций.
- При получении бронирований на объект размещения, у которого есть интеграция с площадкой.
- Всякий раз, когда цены, параметры занятости и ограничений объекта недвижимости были изменены
  в RealtyCalendar самим отельером (например, если отельер добавил в шахматку бронь вручную).
