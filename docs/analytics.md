# CoolCars traffic attribution

The site records first-party attribution for vehicle analytics and CRM leads.

Supported automatically:
- `utm_source`, `utm_medium`, `utm_campaign`
- Google Ads `gclid`
- Meta `fbclid`
- TikTok `ttclid`
- Microsoft Ads `msclkid`
- external referrers such as Google organic, Facebook, Instagram, TikTok and referral domains
- direct traffic

Example campaign URL:

`https://coolcars-pl.vercel.app/samochody/mercedes-atego-1224-chlodnia-2019?utm_source=facebook&utm_medium=paid_social&utm_campaign=mercedes_august`

Admin reporting:
- `/admin` — sales overview
- `/admin/analityka` — per-vehicle conversion, sources and UTM campaigns
- `/admin/zapytania` — CRM with lead source badges and won-deal tracking

Conversion definitions:
- Lead CVR = enquiries / vehicle views in the selected period
- Sale CVR = won CRM deals / vehicle views in the selected period
