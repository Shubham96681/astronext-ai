"""PayU India hosted checkout hash helpers (test + production)."""

from __future__ import annotations

import hashlib
import hmac


def _sha512_hex(value: str) -> str:
    return hashlib.sha512(value.encode("utf-8")).hexdigest().lower()


def build_request_hash(
    *,
    key: str,
    txnid: str,
    amount: str,
    productinfo: str,
    firstname: str,
    email: str,
    salt: str,
    udf1: str = "",
    udf2: str = "",
    udf3: str = "",
    udf4: str = "",
    udf5: str = "",
) -> str:
    """Hash for payment initiation: key|txnid|amount|...|udf5||||||salt"""
    sequence = (
        f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}"
        f"|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||{salt}"
    )
    return _sha512_hex(sequence)


def build_response_hash(
    *,
    salt: str,
    status: str,
    key: str,
    txnid: str,
    amount: str,
    productinfo: str,
    firstname: str,
    email: str,
    udf1: str = "",
    udf2: str = "",
    udf3: str = "",
    udf4: str = "",
    udf5: str = "",
) -> str:
    """Reverse hash for surl/furl callback verification."""
    sequence = (
        f"{salt}|{status}||||||{udf5}|{udf4}|{udf3}|{udf2}|{udf1}"
        f"|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
    )
    return _sha512_hex(sequence)


def verify_response_hash(expected: str, received: str) -> bool:
    return hmac.compare_digest(expected.lower(), (received or "").lower())
