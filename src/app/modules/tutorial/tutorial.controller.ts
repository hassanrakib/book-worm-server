import { makeController } from "../../utils/controller-factory";
import { ITutorial } from "./tutorial.interface";
import { TutorialServices } from "./tutorial.service";

const addTutorialVideo = makeController<{}, ITutorial>({
  service: ({ body }) => TutorialServices.addTutorialVideo(body),
  successMessage: "Video added successfully.",
});

const getTutorials = makeController({
  service: () => TutorialServices.getTutorials(),
  successMessage: "Tutorials retrieved successfully.",
});

export const TutorialControllers = {
  addTutorialVideo,
  getTutorials,
};
