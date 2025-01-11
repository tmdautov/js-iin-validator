
const py = @cImport({
    @cDefine("PY_SSIZE_T_CLEAN", {});
    @cInclude("Python.h");
});
const std = @import("std");
const print = std.debug.print;

const PyObject = py.PyObject;
const PyMethodDef = py.PyMethodDef;
const PyModuleDef = py.PyModuleDef;
const PyModuleDef_Base = py.PyModuleDef_Base;
const Py_BuildValue = py.Py_BuildValue;
const PyModule_Create = py.PyModule_Create;
const METH_NOARGS = py.METH_NOARGS;
const PyArg_ParseTuple = py.PyArg_ParseTuple;
const METH_VARARGS = py.METH_VARARGS;
const Py_False = py.Py_False;
const Py_True = py.Py_True;

fn multiply(iin: [12]i8, w: [11]i8) i16 {
    var result: [11]i8 = undefined;
    var checksum: i16 = 0;
    for (0..11) |i| {
        result[i] = iin[i] * w[i];
        checksum += result[i];
    }
    return @mod(checksum, 11);
}

fn validate_iin(self: [*c]PyObject, args: [*c]PyObject) callconv(.C) [*]PyObject {
    _ = self;
    var string: [*:0]const u8 = undefined;
    _ = PyArg_ParseTuple(args, "s", &string);
    const w1 = [11]i8{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11};
    const w2 = [11]i8{3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2};
    // const result: bool = true;
    var buf: [12]i8 = undefined;
    for (0.., std.mem.sliceTo(string, 0)) |i, char| {
        buf[i] =  @intCast(char - '0');
    }

    var checksum: i16 = multiply(buf, w1);
    if (checksum == 10) {
        checksum = multiply(buf, w2);
    }
    if (checksum == buf[11]) {
        return Py_True();
    } else {
        return Py_False();
    }
}

var Methods = [_]PyMethodDef{
    PyMethodDef{
        .ml_name = "validate_iin",
        .ml_meth = validate_iin,
        .ml_flags = METH_VARARGS,
        .ml_doc = "Validates Kazakhstani IIN",
    },
    PyMethodDef{
        .ml_name = null,
        .ml_meth = null,
        .ml_flags = 0,
        .ml_doc = null,
    },
};

var module = PyModuleDef{
    .m_base = PyModuleDef_Base{
        .ob_base = PyObject{
            .ob_refcnt = 1,
            .ob_type = null,
        },
        .m_init = null,
        .m_index = 0,
        .m_copy = null,
    },
    .m_name = "simple",
    .m_doc = null,
    .m_size = -1,
    .m_methods = &Methods,
    .m_slots = null,
    .m_traverse = null,
    .m_clear = null,
    .m_free = null,
};

pub export fn PyInit_simple() [*]PyObject {
    return PyModule_Create(&module);
}
