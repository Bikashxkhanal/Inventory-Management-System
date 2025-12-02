import React from "react";
import { Container, HomePage, AboutUs, Services, Footer, NavBar } from "../Components/index";

function LandingPage(){
    return(
        <Container >
          
              <HomePage />
              <Services />
              <AboutUs />
              <Footer />
        </Container>
        
    )
}

export default LandingPage;