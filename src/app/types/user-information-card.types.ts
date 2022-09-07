interface InformationCardDataBase {
  title: string;
  subtitle: string;
  content: string;
  images: string[];
}

export type TutorialCardData = InformationCardDataBase;

export type InformationCardData = TutorialCardData;
