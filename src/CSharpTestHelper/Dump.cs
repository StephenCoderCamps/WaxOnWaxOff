using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CSharpTestHelper
{
    public class Dump
    {

        public string Collection<T>(IEnumerable<T> collection)
        {
            var items = new List<string>();
            foreach (var item in collection)
            {
                items.Add(Object(item));
            }
            return String.Join("\n", items);
        }


        public string Object<T>(T thing)
        {
            var results = new List<string>();
            var properties = typeof(T).GetTypeInfo().GetProperties();
            foreach (var prop in properties)
            {
                if (IsSimple(prop.PropertyType))
                results.Add(prop.Name + "=" + prop.GetValue(thing));
            }
            return "{" + String.Join(", ", results) + "}";
        }


        private bool IsSimple(Type type)
        {
            if (type.GetTypeInfo().IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                // nullable type, check if the nested type is simple.
                return IsSimple(type.GetGenericArguments()[0]);
            }
            return type.GetTypeInfo().IsPrimitive
              || type.GetTypeInfo().IsEnum
              || type.Equals(typeof(string))
              || type.Equals(typeof(decimal));
        }

    }
}
