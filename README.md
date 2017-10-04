# README
## Akul Penugonda

This is an app that gets me information that helps me understand Amper Music a little more.

## How does it work?

When you load the webpage, the server renders the writeup while the data is being loaded on the backend to crunch estimated costs, revenue, and cash on hand for the charts.

Two pieces of raw data are pulled from APIs:
* Clients (this is done by scraping the customer showcase section of ampermusic.com over time, through [WebArchive](https://archive.org/help/wayback_api.php))
* Alexa Rank (this is pulled from Amazon's [AWIS API](https://aws.amazon.com/awis/))

I have also pulled information from [BuiltWith](www.builtwith.com) manually to use in my cost analysis.

From the Client information, I extrapolate *revenue* per month by assuming an average deal size of $8000 (taken as a rough average from charts in [this article](https://www.saastr.com/benchmarks-in-saas-for-seed-and-series-a-rounds/)). I also extrapolate the *number of employees* pepr month by assuming that they scale linearly to revenue - I back out a constant factor from my current knowledge of the number of employees in September (14).

From BuiltWith, I know that they are using the following technologies that have a cost:
* 1and1 email/hosting ($5/mo)
* AWS (Modelled below)
* New Relic ($149/mo)
* Keen.io ($4/mo)
* Intercom.io ($66/mo)

From the Alexa ranking, I extrapolate the *number of visits* each month using the equation from [this article](http://netberry.co.uk/alexa-rank-explained.htm). From the number of visits, I estimate that 25% of each visits will result in an hour of usage; this is because they don't appear to be advertising much online, and they've hired some sellers. So most traffic to their website will be to use the platform. As Amazon charges roughly 10 cents per hour, I estimate Amazon's cost at *2.5% of visits*.

I estimate the cost per employee for salary/benefits to be $130000 annually. For rent, each employee should have about 150 sq ft each - and at their building (100 Ave of the Americas according to WHOIS) a sq ft runs for about $75.

All of these calculations are performed for all months since March (when they received funding and launched their website). I also create regression models fit on their revenue and number of visits, and model their costs monthly in the future until they run out of money in order to figure out when that date will be, roughly.

## Challenges I Encountered

The challenges I had were 1) figuring out what to do with the data I had available and 2) underestimating how long it would take to implement my ideas.

When I first had the idea to try to figure out Amper's revenue, I immediately looked for APIs with any indications of cost and revenue. It took me a while to realize that I could use the customer showcase to model revenue - my alternate idea was to use Crunchbase data to model them against comparative companies, but I thought that would have taken too long.

I also thought that I would easily be able to finish within 7 hours (including ideation) but it actually took me almost 10! Estimation is a classic problem but I should have given it more thought here to adjust my scope. If I were to do this project again, I probably would have left out the estimation with the number of employees. I also spent too much time thinking about using real estate APIs, when they only gave me one tiny part of the info I needed for my model.

## Future Plans

If I had more time here, here are some of the things I would add:
* Use jobs data from crunchbase/linkedin/klout/facebook to more accurately estimate salary
* Use real estate APIs to calculate rent in realtime (qandl)
* Update the UI to allow the user to dive deeper into each month's data - so much isn't being exposed
* Update the UI to make the model's calculation more transparent

I also want to mention more resources - there are some APIs like twitter that are behind paywalls. So without those...
* Use twitter alongside with Alexa data for more accurate traffic forecasting
* Use twitter to identify potential clients
* Use BuiltWith's API to calculate technology cost in real time
