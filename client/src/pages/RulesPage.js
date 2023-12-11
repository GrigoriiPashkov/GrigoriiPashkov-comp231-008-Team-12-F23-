import "../styles/rulespage.css";
export const RulesPage = () => {
  return (
    <div className="rules-body">
      <div class="rules-page">
        <header>
          <h1>Event App Rules and Guidelines</h1>
        </header>
        <section class="rules-content">
          <h2>General Conduct</h2>
          <p>
            Our events are dedicated to providing a harassment-free experience
            for everyone, regardless of gender, age, sexual orientation,
            disability, physical appearance, body size, race, or religion (or
            lack thereof). We do not tolerate harassment of event participants
            in any form.
          </p>

          <h2>Responsibilities of Event Organizers</h2>
          <p>
            Organizers are expected to create a safe, engaging, and inclusive
            environment. This includes ensuring the venue is accessible and
            addressing any concerns from attendees promptly.
          </p>

          <h2>Responsibilities of Attendees</h2>
          <p>
            Attendees are expected to behave professionally. Harassment and
            other exclusionary behavior aren't acceptable. This includes but is
            not limited to:
          </p>
          <ul>
            <li>
              Offensive comments related to gender, gender identity and
              expression, age, sexual orientation, disability, mental illness,
              physical appearance, body size, race, or religion.
            </li>
            <li>Deliberate intimidation, stalking, or following.</li>
            <li>Harassing photography or recording.</li>
            <li>Sustained disruption of talks or other events.</li>
            <li>Inappropriate physical contact.</li>
            <li>Unwelcome sexual attention.</li>
          </ul>

          <h2>Enforcement</h2>
          <p>
            Participants asked to stop any harassing behavior are expected to
            comply immediately. If a participant engages in harassing behavior,
            event organizers retain the right to take any actions to keep the
            event a welcoming environment for all participants.
          </p>
        </section>
        <footer className="rules-footer">
          <p>&copy; 2023 Event App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
