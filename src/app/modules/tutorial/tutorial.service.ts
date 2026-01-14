import { ITutorial } from "./tutorial.interface";
import { Tutorial } from "./tutorial.model";

const addTutorialVideo = async (payload: ITutorial) => {
  return await Tutorial.create(payload);
};

const getTutorials = async () => {
  return await Tutorial.find().sort({ createdAt: - 1});
};

export const TutorialServices = {
  addTutorialVideo,
  getTutorials,
};
