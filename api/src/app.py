from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator

from fastapi import FastAPI, Form, status, Query
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age

@app.get("/quotes")
def get_quotes(max_age: str = Query("all")) -> list[Quote]:
    """
    Return quotes filtered by maximum age.

    max_age can be one of: "week", "month", "year", "all" (default).
    """
    now = datetime.now()
    cutoff: datetime | None = None

    if max_age == "week":
        cutoff = now - timedelta(days=7)
    elif max_age == "month":
        cutoff = now - timedelta(days=30)
    elif max_age == "year":
        cutoff = now - timedelta(days=365)
    # if "all" or anything else, leave cutoff = None and return everything

    quotes = database["quotes"]

    if cutoff is None:
        # No filtering needed
        return quotes

    filtered: list[Quote] = []
    for q in quotes:
        # q["time"] is an ISO string, e.g. "2025-11-14T03:21:00"
        try:
            t = datetime.fromisoformat(q["time"])
        except ValueError:
            # If somehow the time is malformed, skip it
            continue

        if t >= cutoff:
            filtered.append(q)

    return filtered
