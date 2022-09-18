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
    title: 'What Actually is a Graph?',
    subtitle: `Graphs are mathematical structures which result from pairwise relations among objects.`,
    content: `But graphs also find a lot of applications outside of mathematics. Consider the following scenario:
    
    You find yourself at the Munich central station and want to reach the Technical University of Munich via public transportation. So you use an app to check the fastest route. Internally, the app might use a graph to represent the subway system with nodes as stations and edges as connections between the stations. The edges are labeled with the time it takes to get form one station to the other. This labeling is usually referred to as the weight of the edge. Certain algorithms can be used to find the shortest route in the subway system.`,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Netzplan_U-Bahn_M%C3%BCnchen.svg/1200px-Netzplan_U-Bahn_M%C3%BCnchen.svg.png',
    ],
  },
  {
    title: 'What is a Pathfinding Algorithm?',
    subtitle: `In the world of graphs, many problems and algorithms are known. However, this application will only deal with shortest path algorithms and its precursors.`,
    content: `This application divides these algorithms into four distinct categories:

    - Traversal: Procedure to iterate over the graph.
    - SPSP (Single Pair Shortest Path): Find the shortest path between two nodes.
    - SSSP (Single Source Shortes Path): Find the shortest path from one node to all the other nodes.
    - APSP (All Pairs Shortest Path): Find the shortest path between all pairs of two nodes in the graph.`,
    images: ['/assets/Screenshot 2022-09-08 201257.png'],
  },
  {
    title: 'Manipulating the Graph',
    subtitle: `With this website you can run the provided algorithms an on any arbitrary graph. To edit the graph use the menu given in the top-left corner.`,
    content: `-Add node: When this button has been clicked, the next mouse leftclick in the graph area will create a new node.
    -Add edge: When this button has been clicked, the you can add an edge by clicking on the starting node (keep it pressed) and releasing the mouse button over the end node.
    -Generate graph: A click on this option will generate a random graph. Beware: This will remove your current graph without warning.
    
    When a node or edge is clicked, a configuration dialog opens in which you can change the labeling of the element. In this dialog, the element can also be removed from the graph - or in the case of an edge - the direction of the edge can be switched.`,
    images: ['/assets/graph_manipulation.webp'],
  },
  {
    title: 'Executing an Algorithm.',
    subtitle: `An algorithm can be chosen in the dropdown menu in the top right corner. The algorithms in the dropdown menu are sorted by the categories explained on page 3. `,
    content: `When an algorithm is selected, a new menu opens to configure the input parameters, such as the start node, for the algorithm. When the input is set accordingly, a click on confirm button will close the dialog and start the algorithm so that it can be stepped through.
    The algorithm can be controlled using the three buttons in the center of the top toolbar. The left button undoes the last step, the right button performs the next step and the middle button can be used to start and stop an the periodical execution of the specified algorithm. When the algorithm is finished, the middle button will visually change and can be used to repeat the algorithm execution from the beginning.`,
    images: ['/assets/algo_control.webp'],
  },
];
