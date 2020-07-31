|Command                |Param        |Default|Description                                     |
|-----------------------|-------------|-------|------------------------------------------------|
|npm run play           |             |       |Runs an actual game                             |
|                       |Depth        |6      |How many steps ahead the AI looks               |
|                       |P1 Bot       |true   |If player 1 is a bot                            |
|                       |P2 Bot       |true   |If player 2 is a bot                            |
|                       |             |       |                                                |
|npm run benchmark      |             |       |Runs a benchmark at a certain depth             |
|                       |Depth        |6      |How many steps ahead the AI looks               |
|                       |Multithreaded|true   |If the AI runs multithreaded                    |
|                       |             |       |                                                |
|npm run depth-benchmark|             |       |Runs a bunch of benchmarks up to a certain depth|
|                       |Max depth    |8      |Up to what depth to benchmark                   |
|                       |Multithreaded|true   |If the AI runs multithreaded                    |