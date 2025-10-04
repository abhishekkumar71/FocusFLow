import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faBlogger } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10 py-6">
      <div className="container mx-auto flex flex-col sm:flex items-center justify-between px-4">
        <p className="text-sm text-slate-500 text-center sm:text-left">
          © {new Date().getFullYear()} FocusFlow — All rights reserved.
        </p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="https://www.linkedin.com/in/abhishek-kumar5471/" target="_blank">
            <FontAwesomeIcon icon={faLinkedin} size="lg" className="text-slate-600 hover:text-blue-600" />
          </a>
          <a href="https://github.com/abhishekkumar71" target="_blank">
            <FontAwesomeIcon icon={faGithub} size="lg" className="text-slate-600 hover:text-black" />
          </a>
          <a href="https://www.blogger.com/profile/11390721205359469828" target="_blank">
            <FontAwesomeIcon icon={faBlogger} size="lg" className="text-slate-600 hover:text-orange-500" />
          </a>
        </div>
      </div>
    </footer>
  );
}
