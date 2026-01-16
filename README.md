# numeri-processor

A lightweight analytics event processor that enriches raw events with geolocation data.

## What it does

This service subscribes to a Redis channel (`raw-events`) and processes incoming analytics events by:

- Enriching events with geolocation data based on IP addresses
- Evaluating visitor IDs from event payloads
- Masking IP addresses after processing for privacy
- Updating event statuses throughout the processing lifecycle

## License

ISC
