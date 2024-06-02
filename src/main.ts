import "./style.css";
const textElement = document.getElementById("text") as HTMLDivElement;
const optionButtonsElement = document.getElementById(
  "option-buttons",
) as HTMLDivElement;

interface State {
  diet: boolean;
  badBody: boolean;
  brain: boolean;
}

interface TextNodeOption {
  text: string;
  nextText: () => number;
  requiredState?: (state: State) => boolean;
  setState?: Partial<State>;
}

interface TextNode {
  id: number;
  text: string;
  options: TextNodeOption[];
}

let state: State = { diet: false, badBody: true, brain: false };

let textNodes: TextNode[] = [];

function startGame() {
  state = { diet: false, badBody: true, brain: false };
  textNodes = [
    {
      id: 1,
      text: "You realized how miserable your life is and how you could change it if you took the right step",
      options: [
        {
          text: "Start crying",
          nextText: () => {
            return 2;
          },
        },
        {
          text: "Stand up and change your life now",
          nextText: () => {
            return 3;
          },
        },
      ],
    },
    {
      id: 2,
      text: "After intense crying, you felt tired and decided to take a nap",
      options: [
        {
          text: '"Proceed"',
          nextText: () => {
            return 4;
          },
        },
      ],
    },
    {
      id: 3,
      text: "You tried to stand up but your constant living with bad habits didnt allow you to do so and you fell asleep",
      options: [
        {
          text: "Proceed",
          nextText: () => {
            return 4;
          },
        },
      ],
    },
    {
      id: 4,
      text: "You woke up and you better feel then usual",
      options: [
        {
          text: "Hmm, what changed?",
          nextText: () => {
            return 5;
          },
        },
      ],
    },
    {
      id: 5,
      text: "You relized that you traveled in time when you slept and now you are 12 years old",
      options: [
        {
          text: "Start changing life",
          nextText: () => {
            return 6;
          },
        },
        {
          text: "Proceed to live like you used to",
          nextText: () => {
            return 7;
          },
        },
      ],
    },
    {
      id: 6,
      text: "What should I do first?",
      options: [
        {
          text: "Start eating healthy",
          nextText: () => {
            changeNodeText(6, "What should I do next?");
            return 6;
          },
          requiredState: () => {
            return state.diet === false;
          },
          setState: { diet: true },
        },
        {
          text: "Start exercising",
          nextText: () => {
            if (state.diet === true) {
              changeNodeText(
                6,
                "Wow i feel like a whole new person. But i feel dumb",
              );
              state.badBody = false;
              return 6;
            } else {
              changeNodeText(
                6,
                "Nah, that too hard, i can not do that without a proper nutrition",
              );
              return 6;
            }
          },
          requiredState: () => {
            return state.badBody === true;
          },
        },
        {
          text: "Start learning programming",
          nextText: () => {
            if (state.diet && !state.badBody) {
              changeNodeText(
                6,
                "Im a total diffrent person!And now i know for sure that i in a computer simulation!",
              );
              state.brain = true;
              return 6;
            } else {
              changeNodeText(
                6,
                "Sitting is hard, and also my spine dosnt feel good. Maybe i should try smth else?",
              );
              return 6;
            }
          },
          requiredState: () => {
            return state.brain === false;
          },
        },
        {
          text: "I'm too tired for that, let's sleep",
          nextText: () => {
            return 7;
          },
          requiredState: () => {
            return state.brain === false;
          },
        },
        {
          text: "Escape the matrix",
          nextText: () => {
            return 8;
          },
          requiredState: () => {
            return state.brain === true;
          },
        },
      ],
    },
    {
      id: 7,
      text: "You lived the same and now you in the same situation",
      options: [
        {
          text: "Sleep",
          nextText: () => {
            if (state.diet) {
              changeNodeText(
                6,
                "Im a better person but i must improve more, lets do:",
              );
              return 5;
            } else {
              changeNodeText(6, "I think i coud do...?");
              return 5;
            }
          },
        },
        {
          text: "Hmm, maybe im in a novel game? Lets try to restart game!",
          nextText: () => {
            return -1;
          },
        },
      ],
    },
    {
      id: 8,
      text: "Thank you for playing",
      options: [
        {
          text: "Restart",
          nextText: () => {
            return -1;
          },
        },
      ],
    },
  ];
  showTextNode(1);
}

function changeNodeText(id: number, text: string) {
  const textNode = textNodes.find((textNode) => textNode.id === id);
  if (textNode) {
    textNode.text = text;
  }
}

function showTextNode(textNodeIndex: number) {
  const textNode = textNodes.find((textNode) => textNode.id === textNodeIndex);
  if (textNode) {
    textElement.innerText = textNode.text;
    while (optionButtonsElement.firstChild) {
      optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    textNode.options.forEach((option) => {
      if (showOption(option)) {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.classList.add("btn");
        button.addEventListener("click", () => selectOption(option));
        optionButtonsElement.appendChild(button);
      }
    });
  }
  console.log(startNodes);
}

function showOption(option: TextNodeOption) {
  return option.requiredState == null || option.requiredState(state);
}

function selectOption(option: TextNodeOption) {
  const nextTextNodeId = option.nextText();
  if (nextTextNodeId <= 0) {
    return startGame();
  }
  state = { ...state, ...option.setState };
  showTextNode(nextTextNodeId);
}

startGame();
