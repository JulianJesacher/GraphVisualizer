import { TutorialCardData } from '../types/user-information-card.types';

export const tutorialCardInformation: TutorialCardData[] = [
  {
    title: 'Welcome to Graph Algorithm Visualizer!',
    subtitle: 'This tutorial will teach you everything you need to know about this application.',
    content:
      "You can navigate the tutorial using the 'Previous' and 'Next' buttons, or you can skip the tutorial if you want to dive right in the action.",
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/6n-graf.svg/1200px-6n-graf.svg.png'],
  },
  {
    title: 'What actually is a graph?',
    subtitle: `Graphs are mathematical structures used to model pairwise relations between objects, they form the foundation of discrete mathematics.`,
    content: `But graphs also find a lot of applications outside of mathemetics. Consider the following scenario: \n You find yourself at the munich central station and want to get to the Technical University of Munich using the public means of transport. So you use an app to check the fastest route. Internally the app uses a graph to represent the subway system with nodes as stations and edges as connections between the stations. The edges are labeled with the time it takes to get form one station to the other. Then a shortest path algorithm is used to find the shourtest route in the subway system. So as you can see, graphs and corresponding algorithms are very important and have lots of useful applications.`,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Netzplan_U-Bahn_M%C3%BCnchen.svg/1200px-Netzplan_U-Bahn_M%C3%BCnchen.svg.png',
    ],
  },
  {
    title: 'What is a graph algorithm?',
    subtitle: `When working with graphs, a lot of challenges arise. Graph algorithms solve these problems, for example: how to traverse a graph, how to find the shortest path between two nodes, find the connected parts of the graph...`,
    content: `There exist a lot of different algorithms which tackle all kinds of problems associated with graps. Some of them are implemented and can be explored in this application.\n\nThe algorithms on this website are divided into 3 Categories:\n-SPSP: Find the shortest path between two nodes.\n-SSSP: Find the shortest path from one node to all the other nodes.\n-APSP: Find the shortest path between all pairs of two nodes in the graph.`,
    images: ['C:\\Coding\\GraphVisualizer\\src\\assets\\Screenshot 2022-09-08 201257.png'],
  },
];
