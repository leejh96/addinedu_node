const { now } = require("mongoose");

function selectAll(pool, collback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            collback(err, null);
            return;
        }
        if (conn) {
            var exec = conn.query(
                "select ?? from ??",
                [["no", "user", "msg", "createDate", "score"], "message"],
                function (queryErr, result) {
                    if (conn != null) {
                        conn.release(); // 처리가 끝나면 마지막에 연결 해제
                    }
                    console.log("exec sql >>>", exec.sql);
                    if (queryErr) {
                        collback(queryErr, null);
                        return;
                    }
                    collback(null, result);
                }
            );
        }
    });
}

function selectSearch(pool, keyword, text, collback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            collback(err, null);
            return;
        }
        if (conn) {
            var exec = conn.query(
                "select ?? from ?? where ?? like ?",
                [["no", "user", "msg", "createDate", "score"], "message", keyword, `%${text}%`],
                function (queryErr, result) {
                    if (conn != null) {
                        conn.release(); // 처리가 끝나면 마지막에 연결 해제
                    }
                    console.log("exec sql >>>", exec.sql);
                    if (queryErr) {
                        collback(queryErr, null);
                        return;
                    }
                    collback(null, result);
                }
            );
        }
    });
}

function selectOne(pool, no, collback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            collback(err, null);
            return;
        }
        if (conn) {
            const exec = conn.query(
                "select ?? from ?? where no=?",
                [["no", "user", "msg", "createDate", "score"], "message", no],
                function (queryErr, result) {
                    if (conn != null) {
                        conn.release(); // 처리가 끝나면 마지막에 연결 해제
                    }
                    console.log("exec sql >>>", exec.sql);
                    if (queryErr) {
                        collback(queryErr, null);
                        return;
                    }
                    collback(null, result);
                }
            );
        }
    });
}

function insertMsg(pool, user, message, collback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            collback(err, null);
            return;
        }
        if (conn) {
            var data = { user: user, msg: message, createDate: now() };
            var exec = conn.query(
                "insert into message set ?",
                data,
                function (queryErr, result) {
                    if (conn != null) {
                        conn.release(); // 처리가 끝나면 마지막에 연결 해제
                    }
                    console.log("exec sql >>>", exec.sql);

                    if (queryErr) {
                        collback(queryErr, null);
                        return;
                    }
                    collback(null, result);
                }
            );
        }
    });
}

//?? : 두개는 sql에 ''가 없어도 되는 곳
//? : sql에 ''가 있어야 하는 곳
function updateMsg(pool, no, user, message, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            callback(err, null);
            return;
        }
        if (conn) {
            var exec = conn.query(
                "update ?? set user=?, msg=? where no=?",
                ["message", user, message, no],
                function (queryErr, result) {
                    console.log("exec sql >>>", exec.sql);
                    if (queryErr) {
                        callback(queryErr, null);
                        return;
                    }
                    callback(null, result);
                }
            );
            if (conn) {
                conn.release(); // 처기가 끝나면 마지막에 연결 해제
            }
        }
    });
}

function updateScore(pool, no, score, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            callback(err, null);
            return;
        }
        if (conn) {
            var exec = conn.query(
                "update ?? set score=? where no=?",
                ["message", score, no],
                function (queryErr, result) {
                    console.log("exec sql >>>", exec.sql);
                    if (queryErr) {
                        callback(queryErr, null);
                        return;
                    }
                    callback(null, result);
                }
            );
            if (conn) {
                conn.release(); // 처기가 끝나면 마지막에 연결 해제
            }
        }
    });
}

function deleteMsg(pool, no, collback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            collback(err, null);
            return;
        }
        if (conn) {
            //
            var exec = conn.query(
                "delete from message where ?",
                { no: no },
                function (queryErr, result) {
                    if (conn != null) {
                        conn.release(); // 처리가 끝나면 마지막에 연결 해제
                    }
                    console.log("exec sql >>>", exec.sql);
                    if (queryErr) {
                        collback(queryErr, null);
                        return;
                    }
                    collback(null, result);
                }
            );
        }
    });
}

function setScore(pool, no, score, collback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 필수
            }
            collback(err, null);
            return;
        }
        if (conn) {
            //
            console.log(">>> dao의 setScore() 실행");

            if (conn) {
                conn.release(); // 처기가 끝나면 마지막에 연결 해제
            }
        }
    });
}

const dao = {};
dao.selectAll = selectAll;
dao.selectOne = selectOne;
dao.insertMsg = insertMsg;
dao.updateMsg = updateMsg;
dao.deleteMsg = deleteMsg;
dao.setScore = setScore;
dao.selectSearch = selectSearch;
dao.updateScore = updateScore;

module.exports = dao;