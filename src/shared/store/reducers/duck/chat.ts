// actions
const SEND_MESSAGE = 'exxatechfront/chat/SEND_MESSAGE';

export const sendMessage = (message: string) => ({
  type: SEND_MESSAGE,
  payload: {
    message,
  },
});

// reducers
const initialState = {
  chats: [],
};

interface ChatAction {
  type: string;
  payload: {
    dataChat: string;
  }
}

export default function chatReducer(state = initialState, action: ChatAction) {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        chats: [...state.chats, action.payload.dataChat],
      };
    default:
      return state;
  }
}

// selectors
export const getChats = (state: string) => state;
