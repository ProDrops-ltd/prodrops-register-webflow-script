function initializeForm() {
  const PD_REGISTER_API = "https://87dc-192-115-72-58.ngrok-free.app/register";
  let currentStep = 1;
  const typeInput = document.querySelector("select[name=type]");
  const warningModal1 = document.querySelector("[data-form-warning-1]");
  const warningModal2 = document.querySelector("[data-form-warning-2]");
  const maxSteps = document.querySelectorAll(".form-wrapper").length + 1;
  const form1 = document.querySelector("#registrationFormStep1");
  const form2 = document.querySelector("#registrationFormStep2");
  const form3 = document.querySelector("#registrationFormStep3");
  const errorText = document.querySelector(
    "#registrationFormStep3Wrapper .input-error"
  );
  const submitButton = document.querySelector("#partner-form-submit");
  const api = PD_REGISTER_API;
  const successModal = document.querySelector("#form-success-wrapper");
  let isSubmitting = false;
  var minAge13 = ["US"];
  var minAge16 = [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "GR",
    "HU",
    "IE",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE",
  ];
  $.validator.addMethod(
    "options",
    function (value, element, options) {
      if (!value) return false;
      if (options.includes(value)) {
        return true;
      } else {
        return false;
      }
    },
    "Please select"
  );
  $.validator.addMethod(
    "minAge",
    function (value, element, min) {
      var today = new Date();
      var birthDate = new Date(value);
      var age = today.getFullYear() - birthDate.getFullYear();

      if (age > min + 1) {
        return true;
      }

      var m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= min;
    },
    "Sorry! Please have a parent or guardian fill out this form for you."
  );
  $.validator.addMethod(
    "regex",
    function (value, element, regexp) {
      var re = new RegExp(regexp);
      return this.optional(element) || re.test(value);
    },
    "Please check your input."
  );

  typeInput.addEventListener("input", function (e) {
    const conditionalElement = document
      .querySelector("input[name=organization]")
      .closest(".input-wrapper");
    const mandatorySocialsWrapper = document.querySelector(
      "[data-socials-mandatory]"
    );
    const mandatorySocials = document.querySelector(
      "[data-socials-representative-optional]"
    );
    const optionalSocials = document.querySelector("[data-socials-optional]");
    if (e.target.value === "Representative") {
      conditionalElement.classList.remove("hidden");
      optionalSocials.before(mandatorySocials);
      mandatorySocialsWrapper.style.display = "none";
    } else {
      conditionalElement.classList.add("hidden");
      mandatorySocialsWrapper.appendChild(mandatorySocials);
      mandatorySocialsWrapper.style.display = "block";
    }
  });
  document
    .querySelector("input[name=games][data-value=Other]")
    .addEventListener("input", function (e) {
      const conditionalElement = document
        .querySelector("input[name=otherGames]")
        .closest(".input-wrapper");
      if (e.target.checked) {
        conditionalElement.classList.remove("hidden");
      } else {
        conditionalElement.classList.add("hidden");
      }
    });
  $("#registrationFormStep1").validate({
    rules: {
      type: {
        required: true,
      },
      organization: {
        minlength: 3,
        maxlength: 20,
        required: function () {
          return typeInput.value === "Representative";
        },
      },
      games: {
        required: function () {
          document.querySelectorAll("input[name=games]:checked").length > 0;
        },
        minlength: 1,
      },
      otherGames: {
        required: function () {
          return document.querySelector("input[name=games][data-value=Other]")
            .checked;
        },
      },
    },
    errorClass: "input-error",
    validClass: "input-valid",
    errorPlacement: function (error, element) {
      error.appendTo(element.closest(".input-wrapper"));
    },
    submitHandler: function (form, e) {
      if ($(form).valid()) {
        nextStep();
      }
    },
  });
  $("#registrationFormStep2").validate({
    rules: {
      firstName: {
        minlength: 3,
        maxlength: 20,
        pattern: /^[\u0000-\u0019\u0021-\uFFFF\s]+$/,
      },
      lastName: {
        minlength: 3,
        maxlength: 20,
        pattern: /^[\u0000-\u0019\u0021-\uFFFF\s]+$/,
      },
      dateOfBirth: {
        minAge:
          !Object.keys(window.geoInfo || {}).length ||
          minAge16.includes(window.geoInfo.country_code)
            ? 16
            : minAge13.includes(window.geoInfo.country_code)
            ? 13
            : 0,
        required: true,
      },
      username: {
        required: true,
        minlength: 4,
        maxlength: 20,
        pattern: /^[\u0000-\u0019\u0021-\uFFFF]+$/,
        remote: {
          url: api + `/validations/username/${$("input[name=username]").val()}`,
          type: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          dataFilter: function (data) {
            return JSON.parse(data).valid;
          },
        },
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: api + `/validations/email/${$("input[name=email]").val()}`,
          type: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          dataFilter: function (data) {
            return JSON.parse(data).valid;
          },
        },
      },
      password: {
        required: true,
        minlength: 8,
        maxlength: 30,
        pattern: /^[A-Za-z0-9!@#$%^&*.,]+$/,
      },
      passwordRepeat: {
        equalTo: "#password",
        required: true,
      },
    },
    errorClass: "input-error",
    validClass: "input-valid",
    errorPlacement: function (error, element) {
      error.appendTo(element.closest(".input-wrapper"));
    },
    submitHandler: function (form, e) {
      if ($(form).valid()) {
        nextStep();
      }
    },
    messages: {
      username: {
        remote: "This username is not available",
      },
      email: {
        remote: "This email is already in use",
      },
    },
  });
  $("[data-form-action=prev]").click(prevStep);
  function nextStep() {
    const newNext = document.querySelector(
      `#registrationFormStep${currentStep + 2}Wrapper`
    );
    const newCurrent = document.querySelector(
      `#registrationFormStep${currentStep + 1}Wrapper`
    );
    const newPrevious = document.querySelector(
      `#registrationFormStep${currentStep}Wrapper`
    );

    if (typeInput.value === "None") {
      warningModal1.style.display = "flex";
      return;
    }
    newCurrent.classList.remove("next");
    newPrevious.classList.add("previous");
    if (newNext) {
      newNext.classList.add("next");
    }
    if (currentStep < maxSteps) {
      currentStep++;
    }
    scrollBack();
  }
  function prevStep() {
    const newNext = document.querySelector(
      `#registrationFormStep${currentStep}Wrapper`
    );
    const newCurrent = document.querySelector(
      `#registrationFormStep${currentStep - 1}Wrapper`
    );
    const newPrevious = document.querySelector(
      `#registrationFormStep${currentStep - 2}Wrapper`
    );
    if (currentStep !== 1) {
      newCurrent.classList.remove("previous");
    }
    if (currentStep > 2) {
      if (!newPrevious.classList.contains("previous")) {
        newPrevious.classList.add("previous");
      }
    }
    newNext.classList.add("next");
    if (currentStep > 0) {
      currentStep--;
    }
    scrollBack();
  }
  function scrollBack() {
    window.scrollTo({
      top: document.querySelector(".signup-wrapper").clientTop,
      behavior: "smooth",
    });
  }

  // Submit logic
  submitButton.addEventListener("click", submitForm);
  async function submitForm() {
    const submitButtonLoadingText = submitButton.getAttribute("data-wait");
    const submitButtonDefaultText = submitButton.getAttribute("data-text");
    try {
      await detectAuthTokens();
      const connections = {};
      document.querySelectorAll("[data-social]").forEach((e) => {
        const provider = e.getAttribute("data-social");
        const oauthToken = localStorage.getItem(
          `partner-form-token-${provider}`
        );
        if (oauthToken) {
          connections[provider] = JSON.parse(oauthToken);
        }
      });
      errorText.innerHTML = "";
      submitButton.innerHTML = submitButtonLoadingText;
      const f1 = new FormData(form1);
      const f2 = new FormData(form2);
      const f3 = new FormData(form3);
      if (f1.get("type") !== "Representative") {
        if (!connections.twitch && !connections.youtube) {
          throw Error("Please connect at least a Twitch or Youtube channel");
        }
      }
      if (f3.get("tos") !== "on" || f3.get("partnersTos") !== "on") {
        throw Error("Please check the last two checkboxes");
      }
      const selectedGames = [];
      document.querySelectorAll("input[name=games]:checked").forEach((e) => {
        selectedGames.push(e.getAttribute("data-value"));
      });
      if (isSubmitting) {
        return;
      }
      isSubmitting = true;
      const res = await fetch(api + "/auth/register/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: f1.get("type"),
          games: selectedGames,
          other_games: f1.get("otherGames"),
          organization: f1.get("organization"),
          first_name: f2.get("firstName"),
          last_name: f2.get("lastName"),
          username: f2.get("username"),
          email: f2.get("email"),
          password: f2.get("password"),
          date_of_birth: f2.get("dateOfBirth"),
          tos: f3.get("tos") === "on" ? true : false,
          tos_partners: f3.get("partnersTos") === "on" ? true : false,
          connections,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "failed") {
        if (data.code === "requirements") {
          warningModal2.style.display = "flex";
          return;
        } else if (data.code === "connection") {
          data.connections.forEach((e) => {
            removeAuthToken({ provider: e });
          });
        }
        errorText.innerHTML = data.message;
        return;
      }
      nextStep();
      document.querySelector(".pf-success-bg").classList.add("success");
    } catch (error) {
      errorText.innerHTML = error.message;
      submitButton.innerHTML = submitButtonDefaultText;
    } finally {
      isSubmitting = false;
      submitButton.innerHTML = submitButtonDefaultText;
    }
  }
  document.querySelector("#ok-success-button").addEventListener("click", () => {
    successModal.classList.remove("active");
  });

  // OAuth logic
  document.querySelectorAll("[data-social]").forEach((e) => {
    const provider = e.getAttribute("data-social");
    e.addEventListener("click", (e) =>
      connectProvider({ allowConnect: true, provider })
    );
    e.parentElement
      .querySelector(".pf-social-connect-button")
      .addEventListener("click", () => connectProvider({ provider }));
  });

  async function connectProvider({ allowConnect, provider }) {
    try {
      const existingToken = localStorage.getItem(
        `partner-form-token-${provider}`
      );
      if (existingToken) {
        if (!allowConnect) {
          removeAuthToken({ provider });
        }
        return;
      }
      const csrfState = Math.random().toString(36).substring(2);
      const bc = new BroadcastChannel(csrfState);
      bc.onmessage = ({ data }) => {
        saveAuthToken(provider, data.replace("#", "?"));
        bc.onmessage = null;
      };
      window.open(
        api + `/oauth/${provider}/${csrfState}`,
        "popup",
        "popup=true,toolbar=false,menubar=false"
      );
    } catch (error) {
      console.error(error);
    }
  }
  function removeAuthToken({ provider }) {
    if (provider) {
      localStorage.removeItem(`partner-form-token-${provider}`);
      detectAuthTokens();
    }
  }
  async function saveAuthToken(provider, url) {
    const params = new URLSearchParams(new URL(url).search);
    let token = params.get("access_token");
    const code = params.get("code");
    let authData = {
      token,
    };
    if (!provider) {
      return;
    }
    if (code) {
      const res = await fetch(
        api + `/oauth/${provider}/token/${encodeURIComponent(code)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok || !data.token) {
        throw Error("Could not get access token from code");
      }
      authData.token = data.token;
    }
    if (!authData.token) {
      return;
    }
    authData.expires_at = Math.floor(Date.now() / 1000 + 60 * 60 * 2);
    localStorage.setItem(
      `partner-form-token-${provider}`,
      JSON.stringify(authData)
    );
    detectAuthTokens();
  }
  async function detectAuthTokens() {
    const l = localStorage;
    const providers = [];
    document.querySelectorAll("[data-social]").forEach((e) => {
      providers.push(e.getAttribute("data-social"));
    });
    providers.forEach((e) => {
      const oauthToken = l.getItem(`partner-form-token-${e}`);
      const button = document.querySelector(`[data-social=${e}]`);
      const buttonParent = button.parentElement;
      const connectButton = buttonParent.querySelector(
        ".pf-social-connect-button"
      );
      const statusText = buttonParent.querySelector(
        ".pf-social-connect-status"
      );
      if (!oauthToken) {
        statusText.innerHTML =
          e.charAt(0).toUpperCase() + e.slice(1) + " not connected";
        statusText.style.color = "#ebebeb";
        connectButton.innerHTML = "Connect";
        connectButton.style.color = "#a352ff";
      } else {
        const authJsonToken = JSON.parse(oauthToken);
        const { token, expires_at } = authJsonToken;
        if (expires_at - 60 * 10 <= Math.floor(Date.now() / 1000)) {
          removeAuthToken({ provider: e });
        }
        statusText.innerHTML =
          e.charAt(0).toUpperCase() + e.slice(1) + " connected";
        statusText.style.color = "var(--primary-1)";
        connectButton.innerHTML = "Disconnect";
        connectButton.style.color = "#EBEBEB";
      }
      if (["twitch", "youtube"].includes(e)) {
        errorText.innerHTML = "";
      }
    });
  }
  detectAuthTokens();
}
initializeForm();
