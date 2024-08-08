document.addEventListener("DOMContentLoaded", () => {
    const gdprQuestions = [
        "Do you have a Data Protection Officer appointed?",
        "Is there a process for data breach notification?",
        "Are data subjects informed about their rights?",
        "Is consent obtained before processing personal data?",
        // Add more GDPR questions as needed
    ];

    const dpdpaQuestions = [
        {
            question: "Which geographical location(s) do you operate from?",
            options: ["India", "Europe", "Other"],
            type: "checkbox"
        },
        {
            question: "Where are your users located?",
            options: ["India", "Europe", "Other"],
            type: "checkbox"
        },
        {
            question: "Do you have explicit consent from the data subject for processing their personal data? (eg. rather than pre-ticked boxes for consent, users need to actively click a box/button.)",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Is your purpose for processing personal data permitted by law?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you have a notice informing the individual about the data being collected, their rights, and how to file a complaint when a user consents to process their personal data?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "When notifying or informing the user about their consent and rights, is it done in simple and plain language?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Is detailed information provided to the user regarding how it will be used?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "If additional services require other or more data, do you obtain explicit consent from the users again?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Is there an option for users to easily withdraw consent?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Is the user data, instantly erased/deleted after the user has withdrawn consent?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you use third party data processing or storing?",
            options: ["yes", "no"],
            type: "radio"
        },
        {
            question: "Do you update users about third-party data sharing?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you take consent, under a valid contract from the users to share their data with third party(s) or other organizations.",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you allow users to edit/remove specific or all personal data on demand easily?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you provide summary of processed personal data provided to users upon request?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Are data access requests fulfilled within a reasonable timeframe, ideally within 24 hours?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you store user data longer than required by law, or longer than necessary to serve the specified purpose, whichever is earlier?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you collect data of individuals under the age of 18 (minors)?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you explicitly obtain parental consent for storing data of underage users?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you ensure no behavioral monitoring is conducted, and guarantee that any data analysis or algorithms used do not harm the child's well-being?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Does your organisation have an appointed Data Protection Officer(DPO) or any administrative role that is tasked with making sure that the user data is protected and used lawfully?",
            options: ["yes", "no"],
            type: "radio"
        },
        {
            question: "Do you have an independent data auditor who conducts regular data protection impact assessments?",
            options: ["yes", "no"],
            type: "radio"
        },
        {
            question: "Does your organization implement the prescribed measures recommended by the independent data auditor within a reasonable timeframe?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Does the data fiduciary have provisions in place allowing a principal to nominate another person to manage their data if they are unavailable?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Do you process any data outside of India?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        },
        {
            question: "Are your data processing activities affiliated with the Gov. of India in any way or form?",
            options: ["yes", "no", "not sure"],
            type: "radio"
        }
    ];

    populateForm('gdprForm', gdprQuestions.map((q) => ({ question: q, options: ["yes", "no"], type: "radio" })));
    populateForm('dpdpaForm', dpdpaQuestions.map((q) => ({ question: q.question, options: q.options, type: q.type })));
    updateStatusBar('gdprForm', 'gdprStatus');
    updateStatusBar('dpdpaForm', 'dpdpaStatus');
});

function populateForm(formId, questions) {
    const form = document.getElementById(formId);
    questions.forEach(item => {
        const labelContainer = document.createElement("div");
        labelContainer.classList.add("label-container");

        const label = document.createElement("label");
        label.textContent = item.question;
        labelContainer.appendChild(label);

        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("options-container");
        item.options.forEach(option => {
            const input = document.createElement("input");
            input.type = item.type;
            input.name = item.question;
            input.value = option;

            const optionLabel = document.createElement("label");
            optionLabel.textContent = option;

            const optionContainer = document.createElement("div");
            optionContainer.classList.add("option-container");
            optionContainer.appendChild(input);
            optionContainer.appendChild(optionLabel);

            optionsContainer.appendChild(optionContainer);
        });

        labelContainer.appendChild(optionsContainer);
        form.appendChild(labelContainer);
    });

    form.addEventListener('change', () => updateStatusBar(formId, formId.replace('Form', 'Status')));
}

function showSection(sectionId) {
    document.querySelectorAll('.checklist-section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelectorAll('.status-bar').forEach(status => {
        status.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById(sectionId + 'Status').style.display = 'block';

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('selected');
    });
    document.getElementById(sectionId + 'Tab').classList.add('selected');
}

function updateStatusBar(formId, statusId) {
    const form = document.getElementById(formId);
    const totalQuestions = form.querySelectorAll('.label-container').length;
    const answeredQuestions = form.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked').length;
    document.getElementById(statusId).textContent = `Answered ${answeredQuestions} of ${totalQuestions} questions`;
}

function submitChecklist() {
    alert('Thank you for filling the form.');
}

function clearResponses() {
    document.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked').forEach(input => {
        input.checked = false;
    });
    updateStatusBar('gdprForm', 'gdprStatus');
    updateStatusBar('dpdpaForm', 'dpdpaStatus');
}
