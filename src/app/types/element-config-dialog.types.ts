interface GraphElementIdentifier {
  type: GraphElementType;
  id: string;
}

export type GraphElementDeleteEvent = GraphElementIdentifier;

interface UpdatePayload {
  label: string;
}

export interface GraphElementUpdateEvent extends GraphElementIdentifier {
  updatedData: UpdatePayload;
}

export type GraphElementType = 'edge' | 'node';
