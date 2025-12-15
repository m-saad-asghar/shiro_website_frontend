import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import {
  AboutUs,
  AgentDetails,
  Area,
  Blog,
  Buy,
  ContactUs,
  Devleoper,
  FAQs,
  ForgotPassword,
  Home,
  ListYourProperty,
  Login,
  MeetOurTeam,
  MyProperty,
  PrivacyPolicy,
  Projects,
  Rent,
  Reviews,
  Services,
  SignUp,
  SingleArea,
  SingleBlog,
  SingleProperty,
  SingleProject,
  SingleService,
  TeamMemberDetails,
  TermsConditions,
} from "../Pages";
import DeveloperDetails from "@/Pages/DeveloperDetails";
import ProjectDetails from "@/Pages/ProjectDetails";
import Communities from "@/Pages/Communities";
import ProtectedRoute from "./ProtectedRoute";
import Cookies from "js-cookie";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/buy/:property-name/:price?/:beds?/:area?/:developer?/:sort?",
        element: <Buy />,
      },
      {
        path: "/rent/:property-name/:price?/:beds?/:area?/:developer?/:sort?",
        element: <Rent />,
      },
      // {
      //   path: "/sell/:id",
      //   element: <Sell />,
      // },
      {
        path: "/:property-name/:price?/:beds?/:area?/:developer?/:sort?",
        element: <Projects />,
      },
      {
        path: "/property-services",
        element: <Services />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/single-property/:slug",
        element: <SingleProperty />,
      },
      {
        path: "/project/:slug",
        element: <SingleProject />,
      },
      {
        path: "/developers",
        element: <Devleoper />,
      },
      {
        path: "/developers/:slug",
        element: <DeveloperDetails />,
      },
       {
        path: "/projects/:slug",
        element: <ProjectDetails />,
      },
      {
        path: "/communities/:slug",
        element: <Communities />,
      },
      {
        path: "/area-guides",
        element: <Area />,
      },
      {
        path: "/myproperty",
        element: (
          <ProtectedRoute
            isAuthenticated={!!Cookies.get("token")}
            element={<MyProperty />}
          />
        ),
      },
      {
        path: "/area-guides/:slug",
        element: <SingleArea />,
      },
      {
        path: "/team",
        element: <MeetOurTeam />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/reviews",
        element: <Reviews />,
      },
      {
        path: "/agent/:id",
        element: <AgentDetails />,
      },
      {
        path: "/team-member/:slug",
        element: <TeamMemberDetails />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog/:slug",
        element: <SingleBlog />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/list-your-property",
        element: <ListYourProperty />,
      },
      {
        path: "/faqs",
        element: <FAQs />,
      },
      {
        path: "/service/:slug",
        element: <SingleService />,
      },
    ],
  },
]);
export default router;
