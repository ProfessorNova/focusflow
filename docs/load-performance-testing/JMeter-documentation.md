# JMeter Documentation

For the Load and Performance Testing section we used Apache JMeter as the other tool Gatling was not suitable for our needs. Below is the documentation for JMeter, including setup, configuration, and results.

## Setup

The setup to create a JMeter test plan was pretty much straightforward.

We created a test plan which is provided in the `docs/templates` directory. There we made two Thread Groups one for the Load Test and one for the Spike Load Test. Each of them contains a HTTP Request Sampler to simulate requests to the SvelteKit application and a Listener Result Tree to log and visualize the results.

## Load Profiles

Load Test Profile:
- 100 Threads (Users)
- 5 seconds ramp-up time
- 20 Users per second
- Loop Count: 10

Result: `./results/Load-Test-Result.jtx`

---

Spike Load Test Profile:
- 500 Threads (Users)
- 1 second ramp-up time
- 500 Users per second
- Loop Count: 2

Result: `./results/Spike-Load-Test-Result.jtx`

## Observations and Bottlenecks

For the Load Test we observed that the SvelteKit application handled the requests well without any significant bottlenecks. All requests were successful and the request were handled within milliseconds so that there were no more threads than 1-2 waiting.

Within the Spike Load Test some requests were delayed and therefore errored out. We defnitely saw a bottleneck there as a previous Spike Load Test configuration with 200 Threads (Users) and a 2 secound ramp-up time did not cause the application any trouble.
However the 500 Threads (Users) with a 1 second ramp-up time were too much for the application to handle at first. Nevertheless after a few seconds the application was able to handle the requests again.

As a summary we can say that the SvelteKit application is powerful and can handle a lot of requests. It has its limits but it is able to recover relatively fast from high loads.