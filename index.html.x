<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Vanilla State Management</title>
</head>
<body>
    <main>
        <section class="app">
            <section class="app__input">
                <div class="js-items" aria-live="polite" aria-label="A list of items you have done"></div>
                <form class="[ new-item ] [ boilerform ] [ js-form ]">
                  <input type="text" class="[ new-item__details ] [ c-input-field ]" id="new-item-field" autocomplete="off" />
                  <button class="[ c-button ] [ new-item__button ]">Save</button>
                </form>
            </section>
            <aside class="app__status">
                <p role="status" class="visually-hidden">You have done <span class="js-status">1 thing</span> today!</p>
                <div class="[ app__decor ] [ js-count ]" aria-hidden="true">
                    <small>You've done</small>
                    <span>1</span>
                    <small>things today 😢</small>
                </div>
            </aside>
        </section>
    </main>
    <script type="module" src="src/client/poop.js"></script>
</body>
</html>
