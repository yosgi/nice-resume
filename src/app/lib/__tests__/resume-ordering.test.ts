import reducer, {
  changeSectionItemSpacing,
  initialResumeState,
  reorderSectionInForm,
} from "lib/redux/resumeSlice";

describe("resume ordering and entry spacing", () => {
  it("reorders featured skills by dragged indices", () => {
    const state = {
      ...initialResumeState,
      skills: {
        ...initialResumeState.skills,
        featuredSkills: [
          { skill: "First", rating: 1 },
          { skill: "Second", rating: 2 },
          { skill: "Third", rating: 3 },
        ],
      },
    };

    const nextState = reducer(
      state,
      reorderSectionInForm({ form: "skills", fromIdx: 0, toIdx: 2 })
    );

    expect(nextState.skills.featuredSkills.map(({ skill }) => skill)).toEqual([
      "Second",
      "Third",
      "First",
    ]);
  });

  it("stores spacing independently for each entry", () => {
    const nextState = reducer(
      initialResumeState,
      changeSectionItemSpacing({
        form: "projects",
        idx: 0,
        value: 18,
      })
    );

    expect(nextState.projects[0].spacing).toBe(18);
    expect(nextState.workExperiences[0].spacing).toBe(6);
  });
});
