function Home(){

    return(
        <div>
            <h1>Välkommen</h1>
            <p>
            Hej och välkommen {localStorage.getItem("email") ? localStorage.getItem("email") : "du okände!" }
            </p>
        </div>
    );
}

export default Home;