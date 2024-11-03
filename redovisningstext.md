# Slutredovisningstext för Projektuppgift på BTH

Detta är en slutredovisningstext för en projektuppgift på BTH. Projektet syftade till att vidareutveckla en webbapplikation. I uppgiften fanns sex olika krav och uppgiften var att implementera 3-6 av dessa. Gruppen har implementerat alla krav och nedan beskrivs översiktligt tillvägagångssättet.

## Autentisering

Kravet gick ut på att endast autentiserade användare skulle ha tillgång till egna dokument och dokument till vilka de blivit inbjudna till att redigera, samt möjligheten att bjuda in andra att redigera dokument.

Autentisering är implementerat med hjälp av tokens (JWT). Token verifieras på två olika sätt, beroende på hur användaren ansluter till appen. För socket-anslutning verifieras token vid anslutning (och anses verifierad tills de avslutar anslutningen). I övrigt används expressjwt som middleware. Expressjwt tillhandahåller ett auth-context. Detta kontext innehåller information om användarens id och mejl. Denna data används i t.ex. GraphQL frågor och mutationer för att verifiera användarens behörighet och att tillhandahålla användarens unika data.

Användarens token sparas i webbläsaren. I frontend finns vissa funktioner som ger användaren viss feedback baserat på om den är autentiserad eller inte.

I appen har vi valt att låta tidigare API-endpoint ligga kvar, utan krav på autentisering.

Vi hade i princip implementerat alla andra funktioner innan autentisering. Det hade varit enklare att implementera autentisering först.

## Sockets

Det här kravet var relativt lätt att implementera. På backend skapades en WebSocket-serverinstans med hjälp av socket.io. Denna instans tillät uppkopplingar från ett par portar på localhost och från student.bth.se. "Rum" skapades baserat på vilket dokument som redigerades. Servern såg till att skicka alla dokumentförändringar den mottog från en användare till övriga. Efter ett tips från Emil såg vi till att även throttla vår dokumentuppladdning mot MongoDB, så att serverinstansen bara skickade uppdaterat innehåll en gång varannan sekund.

Vår komponent SingleDocument tog hand om kopplingen till WebSocket-servern. Med hjälp av olika useEffect-hooks kunde den både ta emot ny text samt skicka tillbaka den till servern. Ett lite större hinder som vi råkade ut för var att vår pekare hoppade tillbaka till början av texten när innehållet renderades om. Lösningen blev att hålla koll på muspekarens position före renderingen och sedan ställa in den igen efter renderingen. När vi implementerade kommentarskravet behövde vi även hålla koll på vilken `<span>`-tagg som pekaren befann sig i. För detta använde vi `document.createTreeWalker()` och traverserade de olika noder där pekaren kunde tänkas finnas.

## Kommentarer

För att uppfylla Krav 3 implementerade vi en `<span>`-lösning som omsluter markerad text när en kommentar läggs till, vilket gör det möjligt att lagra kommenterade textstycken. Denna metod gjorde det enkelt att visualisera kommentarer direkt i dokumentet, då varje `<span>` ges en gul bakgrund för att framhäva text som är kommenterad. Användning av `window.getSelection` hjälpte till att identifiera användarens textmarkering. Vi tilldelade varje kommentar ett unikt ID med hjälp av tidsstämpeln, och kommentaren i sig sparades som `<span>`-elementets titel. Vid borttagning av kommentar tog vi helt enkelt bort `<span>`-elementet, medan innehållet behölls intakt i dokumentet.

Gränssnittet gjordes intuitivt i CommentManager-komponenten, där knappar för att lägga till och visa kommentarer placerades synligt.

## Code-mode

För att implementera Krav 4 lade vi till en ny bool-property ”isCode” i ”Document” för att hantera växlingen till code-mode, vilket också sparas i databasen. Två nya funktioner lades till: Först ”toggleCodeMode”, som växlar mellan text- och code-mode genom att ändra tidigare nämnda boolean. Därefter ”executeCode”, en API-integration med execjs.emilfolino.se, där koden skickas som en base64-kodad sträng för exekvering. Vi integrerade CodeMirror som en ny komponent i returblocken för att fungera som kodeditor när code-mode är aktivt. Vid exekvering hämtas resultat och visas direkt för användaren. Slutligen lades HTML-element till för knapparna som växlar läge och exekverar koden.

Vi fick även implementera att befintliga kommentarer i skrivläget tas bort, föregått av en varning angående detta, om användaren byter till kodläge. Kommentarer kunde ha arbetats in även i kodläge men hade krävt en omstrukturering av vår span-lösning för kommentarer. Vi bedömde att det huvudsyftet var en texteditor.

## GraphQL

Vi valde att implementera GraphQL endast för att hämta data från API, alltså inte för att göra förändringar. Varken i frontend eller backend stötte vi på några större problem. Det enda som krävde lite extra eftertanke var att skapa schemat, definiera typerna för de olika fälten och koppla schemat till våra befintliga funktioner.

Vi gjorde några enkla justeringar i frontend för att omvandla svaren från GraphQL till den typ av JSON-objekt som våra komponenter är anpassade för. Vi lyckades dock inte få GraphQL att deployas på Azure, trots att vi inte fick några felmeddelanden i VS Code. När vi läste loggen i Azure upptäckte vi att vår version av GraphQL var för ny, så vi var tvungna att nedgradera den.

## Testning

Vi har använt Mocha, Chai och Chai-HTTP, och satt upp kontinuerlig testning genom GitHub Actions. Vi har främst valt att testa backend, även om det finns vissa triviala tester för frontend. För frontend så körs testerna med det som kom med react create app, och det är inte integrerat med github actions.

Kravet var att man skulle känna förtroende för de features som är implementerade.

- **Authentication**: testar att det går att lägga till en ny användare, testar att det inte går att lägga till en användare med redan existerande mejl, testar att det inte går att hämta en post utan att ha en token. Här skulle man kunna lägga till lite olika tester som visar att en autentiserad användare har tillgång till enbart sina egna dokument och dokument som den blivit inbjuden till.
- **Sockets**: testar att skapa dokument och att uppdateringar publiceras.
- **Comments**: vi testar att databasen fungerar generellt, men just comments funktionen är inte testad explicit eftersom det handlar om vad som sparas i databasen.
- **Code mode**: samma som ovan.
- **GraphQL**: vi testar GraphQL indirekt, t.ex. vid authentication, så skapas användare via GraphQL och dokument hämtas via GraphQL.

Utöver att testa ovanstående features testar vi API:t sen tidigare (kräver ej authentication), samt databas-funktionaliteten. Det här ger oss förtroende för att backend fungerar som den ska. Det går att utveckla testningen vidare men vi väljer att det här är good enough.

Vi stötte på ett problem med testningen, och det var när vi vill ha flera tester som gör HTTP-anrop med vår app med hjälp av chai-http. Testfilerna fungerar när de körs var för sig, men när vi kör `npm test` så misslyckas en av testfilerna. Vi ställde frågan i chatten och på stackoverflow, men fick nöja oss med att lägga alla tester som använder chai-http i filen `test-api`.

## Förbättringar och optimeringar

Det finns en rad möjliga förbättringar i appen. Vårt fokus har varit att implementera kraven. Några förbättringar som går att göra:

- **Ta bort API-endpoint som inte kräver autentisering**: Det finns en endpoint som inte kräver autentisering. Detta är en säkerhetsrisk och bör åtgärdas.
- **Tillåta att mer än 2 användare kan redigera ett dokument**: Vi har implementerat att en användare kan bjuda in en annan användare att redigera ett dokument. Det är bara ägaren som kan bjuda in. När ägaren bjuder in någon att redigera så försvinner tidigare editorer.
- **Konsekvent användning av GraphQL-endpoint för alla CRUD-operationer till databasen**: Ibland används GraphQL-endpointen, ibland används direkt anrop till databasen. Detta kan göras konsekvent istället, vilket skulle minimera risken för att autentiseringen kan kringgås.
- **Bättre felhantering**: Vi har inte lagt så mycket fokus på felhantering.
- **Bättre testning**: Vi valde tidigt att använda Mocha, Chai och Chai-HTTP för att testa backend, eftersom det beskrevs som populärt och i viss utsträckning också ingick i kursmaterialet. Den buggen som beskrivs ovan tog mycket tid att försöka lösa, i efterhand hade det varit bättre att lägga den tiden på att göra bättre tester, och kanske använda ett annat testramverk. Det hade också varit bra att testa frontend.
- **URL-parametrar**: I våra lokala miljöer så fungerar det att gå till en specifik URL (t.ex. den som skickas ut i mejlet, editor/documents/document_id) för att få tillgång till ett dokument eller en specfik vy. På studentservern fungerar det inte.