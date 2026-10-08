export const routeBuilder = {
  testPreview: (id: string) => `/tests-list/${id}`,
  testSetup: (id: string) => `/test-setup/${id}`,
  testPlayground: (sessionId: string, questionIndex: number) =>
    `/playground/${sessionId}?questionIndex=${questionIndex}`,
  createTest: () => "/create-test",
  updateTest: (id: string) => `/update-test/${id}`,
};
